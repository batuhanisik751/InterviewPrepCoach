import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@/lib/ai/anthropic";
import { questionsSchema } from "@/lib/ai/schemas";
import { QUESTION_GENERATION_PROMPT, buildQuestionPrompt } from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await request.json();

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 });
  }

  // Fetch the session
  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status !== "draft") {
    return NextResponse.json(
      { error: "Questions already generated for this session" },
      { status: 400 }
    );
  }

  try {
    // Generate questions using Claude
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: questionsSchema,
      prompt: buildQuestionPrompt(session.resume_text, session.job_description),
      system: QUESTION_GENERATION_PROMPT,
    });

    // Insert questions into the database
    const questionsToInsert = object.questions.map((q, index) => ({
      session_id: sessionId,
      question_text: q.question_text,
      question_type: q.question_type,
      difficulty: q.difficulty,
      target_skill: q.target_skill,
      sort_order: index,
    }));

    const { error: insertError } = await supabase
      .from("questions")
      .insert(questionsToInsert);

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to save questions" },
        { status: 500 }
      );
    }

    // Update session status to in_progress
    await supabase
      .from("sessions")
      .update({ status: "in_progress", updated_at: new Date().toISOString() })
      .eq("id", sessionId);

    return NextResponse.json({ questions: object.questions });
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
