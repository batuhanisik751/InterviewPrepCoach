import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@/lib/ai/openai";
import { evaluationSchema, behavioralEvaluationSchema } from "@/lib/ai/schemas";
import {
  ANSWER_EVALUATION_PROMPT,
  buildEvaluationPrompt,
  BEHAVIORAL_EVALUATION_PROMPT,
  buildBehavioralEvaluationPrompt,
} from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";

interface QAPair {
  mockQuestion: string;
  userAnswer: string;
}

function extractQAPairs(
  messages: { role: string; content: string }[]
): QAPair[] {
  const pairs: QAPair[] = [];
  for (let i = 0; i < messages.length - 1; i++) {
    const msg = messages[i];
    const next = messages[i + 1];
    // Assistant message containing a question followed by a user response
    if (
      msg.role === "assistant" &&
      msg.content.includes("?") &&
      next.role === "user"
    ) {
      pairs.push({
        mockQuestion: msg.content,
        userAnswer: next.content,
      });
    }
  }
  return pairs;
}

function computeWordOverlap(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/));
  const wordsB = new Set(b.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/));
  let overlap = 0;
  for (const word of wordsA) {
    if (word.length > 3 && wordsB.has(word)) overlap++;
  }
  return overlap;
}

function matchToPregenerated(
  mockQuestion: string,
  pregenQuestions: { id: string; question_text: string; question_type: string }[],
  usedIds: Set<string>
): { id: string; question_text: string; question_type: string } | null {
  let bestMatch = null;
  let bestScore = -1;

  for (const q of pregenQuestions) {
    if (usedIds.has(q.id)) continue;
    const score = computeWordOverlap(mockQuestion, q.question_text);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = q;
    }
  }

  return bestMatch;
}

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
    return NextResponse.json(
      { error: "Session ID required" },
      { status: 400 }
    );
  }

  // Fetch session
  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Fetch mock messages
  const { data: mockMessages } = await supabase
    .from("mock_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (!mockMessages || mockMessages.length === 0) {
    return NextResponse.json(
      { error: "No mock messages found" },
      { status: 400 }
    );
  }

  // Fetch pre-generated questions
  const { data: pregenQuestions } = await supabase
    .from("questions")
    .select("id, question_text, question_type")
    .eq("session_id", sessionId)
    .order("sort_order", { ascending: true });

  if (!pregenQuestions || pregenQuestions.length === 0) {
    return NextResponse.json(
      { error: "No questions found for session" },
      { status: 400 }
    );
  }

  // Check if answers already exist for this session (prevent duplicates)
  const questionIds = pregenQuestions.map((q) => q.id);
  const { count: existingAnswers } = await supabase
    .from("answers")
    .select("*", { count: "exact", head: true })
    .in("question_id", questionIds);

  if (existingAnswers && existingAnswers > 0) {
    return NextResponse.json(
      { error: "Answers already saved for this session" },
      { status: 409 }
    );
  }

  // Extract Q&A pairs from mock messages
  const qaPairs = extractQAPairs(mockMessages);

  if (qaPairs.length === 0) {
    return NextResponse.json(
      { error: "No question-answer pairs found in mock messages" },
      { status: 400 }
    );
  }

  // Match each Q&A pair to a pre-generated question
  const usedIds = new Set<string>();
  const matchedPairs: {
    question: { id: string; question_text: string; question_type: string };
    userAnswer: string;
  }[] = [];

  for (const pair of qaPairs) {
    const match = matchToPregenerated(
      pair.mockQuestion,
      pregenQuestions,
      usedIds
    );
    if (match) {
      usedIds.add(match.id);
      matchedPairs.push({ question: match, userAnswer: pair.userAnswer });
    }
  }

  if (matchedPairs.length === 0) {
    return NextResponse.json(
      { error: "Could not match mock answers to questions" },
      { status: 400 }
    );
  }

  // Save answers and run evaluations
  const evaluationResults = [];

  for (const { question, userAnswer } of matchedPairs) {
    // Save answer
    const { data: answer, error: answerError } = await supabase
      .from("answers")
      .insert({
        question_id: question.id,
        user_answer: userAnswer,
      })
      .select("id")
      .single();

    if (answerError || !answer) continue;

    const isBehavioral = question.question_type === "behavioral";

    try {
      let evaluation;
      let starBreakdown = null;
      let starDetected = false;

      if (isBehavioral) {
        const { object } = await generateObject({
          model: openai.chat("mistral"),
          schema: behavioralEvaluationSchema,
          prompt: buildBehavioralEvaluationPrompt(
            session.resume_text,
            session.job_description,
            question.question_text,
            userAnswer
          ),
          system: BEHAVIORAL_EVALUATION_PROMPT,
        });

        evaluation = {
          clarity_score: object.clarity_score,
          structure_score: object.structure_score,
          depth_score: object.depth_score,
          overall_score: object.overall_score,
          feedback: object.feedback,
          suggested_answer: object.suggested_answer,
        };

        starBreakdown = {
          situation: object.situation,
          task: object.task,
          action: object.action,
          result: object.result,
          missing_components: object.missing_components,
          improvement_tips: object.improvement_tips,
        };

        starDetected =
          object.situation.present &&
          object.task.present &&
          object.action.present &&
          object.result.present;
      } else {
        const { object } = await generateObject({
          model: openai.chat("mistral"),
          schema: evaluationSchema,
          prompt: buildEvaluationPrompt(
            session.resume_text,
            session.job_description,
            question.question_text,
            userAnswer
          ),
          system: ANSWER_EVALUATION_PROMPT,
        });
        evaluation = object;
      }

      // Save evaluation
      await supabase.from("evaluations").insert({
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

      evaluationResults.push(evaluation);
    } catch {
      // Continue with remaining evaluations even if one fails
      continue;
    }
  }

  // Calculate overall score and update session
  if (evaluationResults.length > 0) {
    const avgScore =
      evaluationResults.reduce((sum, e) => sum + (e.overall_score || 0), 0) /
      evaluationResults.length;

    await supabase
      .from("sessions")
      .update({
        overall_score: Math.round(avgScore * 10) / 10,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);
  }

  return NextResponse.json({
    saved: matchedPairs.length,
    evaluated: evaluationResults.length,
    resultsUrl: `/session/${sessionId}/results`,
  });
}
