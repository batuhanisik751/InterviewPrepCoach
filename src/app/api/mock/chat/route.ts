import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@/lib/ai/anthropic";
import { buildMockInterviewSystem } from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, sessionId } = await request.json();

  if (!sessionId) {
    return new Response("Session ID required", { status: 400 });
  }

  const { data: session } = await supabase
    .from("sessions")
    .select("resume_text, job_description, job_title")
    .eq("id", sessionId)
    .single();

  if (!session) {
    return new Response("Session not found", { status: 404 });
  }

  const systemPrompt = buildMockInterviewSystem(
    session.resume_text,
    session.job_description,
    session.job_title
  );

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages: modelMessages,
    onFinish: async ({ text }) => {
      // Persist the latest assistant message
      await supabase.from("mock_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: text,
      });
    },
  });

  return result.toUIMessageStreamResponse();
}
