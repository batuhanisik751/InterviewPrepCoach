import { NextResponse } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { openai } from "@/lib/ai/openai";
import { buildMockInterviewSystem } from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { rejectIfInjection, moderateContent } from "@/lib/guardrails";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimit = checkRateLimit(user.id);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later.", remaining: 0, resetAt: rateLimit.resetAt },
      { status: 429 }
    );
  }

  const { messages, sessionId } = await request.json();

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 });
  }

  // Guardrails: check last user message for injection and inappropriate content
  if (messages && messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === "user") {
      const content =
        typeof lastMsg.content === "string" ? lastMsg.content : "";

      const injection = rejectIfInjection(content);
      if (injection.rejected) {
        return NextResponse.json(
          { error: "Your message contains disallowed content." },
          { status: 400 }
        );
      }

      const moderation = moderateContent(content);
      if (moderation.severity === "block") {
        return NextResponse.json(
          { error: "Your message contains inappropriate content." },
          { status: 400 }
        );
      }
    }
  }

  const { data: session } = await supabase
    .from("sessions")
    .select("resume_text, job_description, job_title")
    .eq("id", sessionId)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Fetch pre-generated questions for this session
  const { data: questions } = await supabase
    .from("questions")
    .select("id, question_text, question_type")
    .eq("session_id", sessionId)
    .order("sort_order", { ascending: true });

  // Count existing assistant messages with questions to enforce 3-4 question limit
  const { count: assistantMsgCount } = await supabase
    .from("mock_messages")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionId)
    .eq("role", "assistant");

  try {
    const questionList = (questions || []).map((q) => ({
      id: q.id,
      text: q.question_text,
      type: q.question_type,
    }));

    // Determine which turn the AI is on (0 = first message, 1 = after Q1 answered, etc.)
    const turnNumber = assistantMsgCount ?? 0;
    const totalQuestions = questionList.length;

    let systemPrompt = buildMockInterviewSystem(
      session.resume_text,
      session.job_description,
      session.job_title,
      questionList
    );

    // Inject explicit turn instruction so the model knows exactly what to do
    if (turnNumber === 0) {
      systemPrompt += `\n\nYOU ARE ON MESSAGE 1. Introduce yourself and ask question #1 ONLY. Output NOTHING else. Do NOT ask question #2.`;
    } else if (turnNumber < totalQuestions) {
      systemPrompt += `\n\nYOU ARE ON MESSAGE ${turnNumber + 1}. The candidate just answered question #${turnNumber}. Acknowledge in ONE short sentence, then ask question #${turnNumber + 1} EXACTLY as written. Output NOTHING else. Do NOT ask question #${turnNumber + 2}. Do NOT provide feedback or rewrite their answer.`;
    } else {
      systemPrompt += `\n\nTHIS IS THE FINAL MESSAGE. The candidate has answered all questions. Do NOT ask another question. Provide your Interview Reflection and Recommendation, then end with "Thank you for completing this mock interview".`;
    }

    const modelMessages = await convertToModelMessages(messages);

    // Use more tokens for the final wrap-up message that includes comprehensive feedback
    const isFinalTurn = turnNumber >= totalQuestions;
    const result = streamText({
      model: openai.chat("mistral"),
      system: systemPrompt,
      messages: modelMessages,
      maxOutputTokens: isFinalTurn ? 800 : 200,
      onFinish: async ({ text }) => {
        await supabase.from("mock_messages").insert({
          session_id: sessionId,
          role: "assistant",
          content: text,
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Mock interview error:", error);
    return NextResponse.json(
      { error: "Failed to process mock interview" },
      { status: 500 }
    );
  }
}
