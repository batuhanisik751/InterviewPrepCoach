"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, RefreshCw } from "lucide-react";
import { QuestionCard } from "@/components/features/QuestionCard";
import { WeakPointsList } from "@/components/features/WeakPointsList";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { QuestionType, Difficulty, WeakPoint } from "@/types";

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
  initialWeakPoints: WeakPoint[] | null;
}

export function SessionQuestions({
  sessionId,
  initialStatus,
  initialQuestions,
  answeredQuestionIds,
  initialWeakPoints,
}: SessionQuestionsProps) {
  const [questions] = useState<QuestionRow[]>(initialQuestions);
  const [weakPoints, setWeakPoints] = useState<WeakPoint[] | null>(initialWeakPoints);
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

      // Weak points are saved server-side by the generate route
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
        <p className="text-muted-foreground">
          Generating tailored interview questions...
        </p>
        <p className="text-sm text-muted-foreground">
          This may take a few seconds.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <p className="mb-4 text-destructive">{error}</p>
        <Button onClick={generateQuestions} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No questions yet.</p>
      </div>
    );
  }

  const answeredCount = answeredQuestionIds.length;

  return (
    <div className="flex flex-col gap-4">
      {weakPoints && weakPoints.length > 0 && (
        <WeakPointsList weakPoints={weakPoints} />
      )}

      <p className="text-sm text-muted-foreground">
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

      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <p className="mb-2 text-sm font-medium text-foreground">
          Ready to practice with a live interviewer?
        </p>
        <p className="mb-4 text-xs text-muted-foreground">
          Start a conversational mock interview based on your resume and job
          description.
        </p>
        <Link href={`/session/${sessionId}/mock`}>
          <Button className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Start Mock Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}
