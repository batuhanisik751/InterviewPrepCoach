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

  try {
    const systemPrompt = buildMockInterviewSystem(
      session.resume_text,
      session.job_description,
      session.job_title
    );

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-oss-120b"),
      system: systemPrompt,
      messages: modelMessages,
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
