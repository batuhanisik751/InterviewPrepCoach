import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@/lib/ai/anthropic";
import { evaluationSchema, starAnalysisSchema } from "@/lib/ai/schemas";
import {
  ANSWER_EVALUATION_PROMPT,
  buildEvaluationPrompt,
  STAR_ANALYSIS_PROMPT,
  buildStarPrompt,
} from "@/lib/ai/prompts";
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

  const { questionId, userAnswer } = await request.json();

  if (!questionId || !userAnswer) {
    return NextResponse.json(
      { error: "Question ID and answer are required" },
      { status: 400 }
    );
  }

  // Fetch the question and its parent session
  const { data: question } = await supabase
    .from("questions")
    .select("*, sessions(*)")
    .eq("id", questionId)
    .single();

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const session = question.sessions;
  const isBehavioral = question.question_type === "behavioral";

  try {
    // Save the user's answer
    const { data: answer, error: answerError } = await supabase
      .from("answers")
      .insert({
        question_id: questionId,
        user_answer: userAnswer,
      })
      .select("id")
      .single();

    if (answerError || !answer) {
      return NextResponse.json(
        { error: "Failed to save answer" },
        { status: 500 }
      );
    }

    // Evaluate using Claude
    const { object: evaluation } = await generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: evaluationSchema,
      prompt: buildEvaluationPrompt(
        session.resume_text,
        session.job_description,
        question.question_text,
        userAnswer
      ),
      system: ANSWER_EVALUATION_PROMPT,
    });

    // Run STAR analysis for behavioral questions
    let starBreakdown = null;
    let starDetected = false;

    if (isBehavioral) {
      const { object: starResult } = await generateObject({
        model: anthropic("claude-sonnet-4-20250514"),
        schema: starAnalysisSchema,
        prompt: buildStarPrompt(question.question_text, userAnswer),
        system: STAR_ANALYSIS_PROMPT,
      });

      starBreakdown = starResult;
      starDetected =
        starResult.situation.present &&
        starResult.task.present &&
        starResult.action.present &&
        starResult.result.present;
    }

    // Save evaluation with STAR data
    const { error: evalError } = await supabase.from("evaluations").insert({
      answer_id: answer.id,
      clarity_score: evaluation.clarity_score,
      structure_score: evaluation.structure_score,
      depth_score: evaluation.depth_score,
      overall_score: evaluation.overall_score,
      feedback: evaluation.feedback,
      suggested_answer: evaluation.suggested_answer,
      star_detected: starDetected,
      star_breakdown: starBreakdown,
    });

    if (evalError) {
      return NextResponse.json(
        { error: "Failed to save evaluation" },
        { status: 500 }
      );
    }

    // Check if all questions in the session have been answered
    const { count: totalQuestions } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .eq("session_id", session.id);

    const { count: answeredQuestions } = await supabase
      .from("answers")
      .select("*, questions!inner(*)", { count: "exact", head: true })
      .eq("questions.session_id", session.id);

    if (totalQuestions && answeredQuestions && answeredQuestions >= totalQuestions) {
      const { data: allEvals } = await supabase
        .from("evaluations")
        .select("overall_score, answers!inner(questions!inner(session_id))")
        .eq("answers.questions.session_id", session.id);

      if (allEvals && allEvals.length > 0) {
        const avgScore =
          allEvals.reduce((sum, e) => sum + (e.overall_score || 0), 0) /
          allEvals.length;

        await supabase
          .from("sessions")
          .update({
            overall_score: Math.round(avgScore * 10) / 10,
            status: "completed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", session.id);
      }
    }

    return NextResponse.json({
      answerId: answer.id,
      evaluation,
      starBreakdown,
    });
  } catch (error) {
    console.error("Answer evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
