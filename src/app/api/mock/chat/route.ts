import { NextResponse } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { openai } from "@/lib/ai/openai";
import { buildMockInterviewSystem } from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

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

    let systemPrompt = buildMockInterviewSystem(
      session.resume_text,
      session.job_description,
      session.job_title,
      questionList
    );

    // If 4+ assistant messages already exist, force wrap-up
    if (assistantMsgCount && assistantMsgCount >= 4) {
      systemPrompt += "\n\nCRITICAL: You have already asked enough questions. You MUST wrap up NOW. Do NOT ask another question. Provide your final summary and include the phrase \"Thank you for completing this mock interview\".";
    }

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openai.chat("mistral"),
      system: systemPrompt,
      messages: modelMessages,
      maxOutputTokens: 300,
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
