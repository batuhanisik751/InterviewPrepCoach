import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@/lib/ai/openai";
import { questionsWithWeakPointsSchema } from "@/lib/ai/schemas";
import { QUESTION_AND_WEAKPOINTS_PROMPT, buildQuestionAndWeakPointsPrompt } from "@/lib/ai/prompts";
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
    // Generate questions and detect weak points in a single call
    const { object } = await generateObject({
      model: openai("mistral"),
      schema: questionsWithWeakPointsSchema,
      prompt: buildQuestionAndWeakPointsPrompt(session.resume_text, session.job_description),
      system: QUESTION_AND_WEAKPOINTS_PROMPT,
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

    // Update session status and save weak points
    await supabase
      .from("sessions")
      .update({
        status: "in_progress",
        weak_points: object.weak_points,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    return NextResponse.json({
      questions: object.questions,
      weak_points: object.weak_points,
    });
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
