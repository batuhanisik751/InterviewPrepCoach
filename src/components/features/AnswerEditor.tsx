"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import type { EvaluationData } from "@/components/features/QuestionCard";

interface AnswerEditorProps {
  questionId: string;
  questionType: string;
  onAnswerSubmitted?: (evaluation: EvaluationData) => void;
}

export function AnswerEditor({ questionId, questionType, onAnswerSubmitted }: AnswerEditorProps) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBehavioral = questionType === "behavioral";

  async function handleSubmit() {
    if (answer.trim().length < 10) {
      setError("Please provide a more detailed answer (at least 10 characters).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/answers/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, userAnswer: answer }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to evaluate answer");
        setLoading(false);
        return;
      }

      onAnswerSubmitted?.({
        clarity_score: data.evaluation.clarity_score,
        structure_score: data.evaluation.structure_score,
        depth_score: data.evaluation.depth_score,
        overall_score: data.evaluation.overall_score,
        feedback: data.evaluation.feedback,
        suggested_answer: data.evaluation.suggested_answer,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <Textarea
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={4}
        className="min-h-[120px] resize-none"
        disabled={loading}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {answer.length} characters
          {isBehavioral && " \u2014 Use STAR format for best results"}
        </span>
        <Button onClick={handleSubmit} disabled={loading} size="sm" className="gap-2">
          {loading ? (
            <>
              <Spinner size="sm" />
              Evaluating...
            </>
          ) : (
            <>
              <Send className="h-3 w-3" />
              Submit Answer
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
