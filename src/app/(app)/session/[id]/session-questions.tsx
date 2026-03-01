"use client";

import { useState, useEffect } from "react";
import { QuestionCard } from "@/components/features/QuestionCard";
import { Spinner } from "@/components/ui/Spinner";
import type { QuestionType, Difficulty } from "@/types";

interface QuestionRow {
  id: string;
  question_text: string;
  question_type: QuestionType;
  difficulty: Difficulty;
  target_skill: string;
  sort_order: number;
}

interface SessionQuestionsProps {
  sessionId: string;
  initialStatus: string;
  initialQuestions: QuestionRow[];
  answeredQuestionIds: string[];
}

export function SessionQuestions({
  sessionId,
  initialStatus,
  initialQuestions,
  answeredQuestionIds,
}: SessionQuestionsProps) {
  const [questions] = useState<QuestionRow[]>(initialQuestions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialStatus === "draft" && questions.length === 0) {
      generateQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generateQuestions() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to generate questions");
        setLoading(false);
        return;
      }

      window.location.reload();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <Spinner size="lg" />
        <p className="text-muted">
          Generating tailored interview questions...
        </p>
        <p className="text-sm text-muted">This may take a few seconds.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger/20 bg-danger/5 p-8 text-center">
        <p className="mb-4 text-danger">{error}</p>
        <button
          onClick={generateQuestions}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-12 text-center">
        <p className="text-muted">No questions yet.</p>
      </div>
    );
  }

  const answeredCount = answeredQuestionIds.length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        {answeredCount} of {questions.length} questions answered
      </p>
      {questions.map((q, index) => (
        <QuestionCard
          key={q.id}
          questionId={q.id}
          index={index}
          questionText={q.question_text}
          questionType={q.question_type}
          difficulty={q.difficulty}
          targetSkill={q.target_skill}
          hasAnswer={answeredQuestionIds.includes(q.id)}
        />
      ))}
    </div>
  );
}
