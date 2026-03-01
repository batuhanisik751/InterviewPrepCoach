"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { ScoreDisplay } from "./ScoreDisplay";
import { StarBreakdown } from "./StarBreakdown";

interface StarComponentData {
  present: boolean;
  text: string;
  score: number;
}

interface StarBreakdownData {
  situation: StarComponentData;
  task: StarComponentData;
  action: StarComponentData;
  result: StarComponentData;
  missing_components: string[];
  improvement_tips: string[];
}

interface EvaluationResult {
  clarity_score: number;
  structure_score: number;
  depth_score: number;
  overall_score: number;
  feedback: string;
  suggested_answer: string;
}

interface AnswerEditorProps {
  questionId: string;
  questionType: string;
}

export function AnswerEditor({ questionId, questionType }: AnswerEditorProps) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [starData, setStarData] = useState<StarBreakdownData | null>(null);
  const [showSuggested, setShowSuggested] = useState(false);

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

      setEvaluation(data.evaluation);
      if (data.starBreakdown) {
        setStarData(data.starBreakdown);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (evaluation) {
    return (
      <div className="mt-4 space-y-4">
        <div className="rounded-lg border border-border bg-surface-secondary p-4">
          <p className="mb-3 text-sm font-medium text-muted">Your answer:</p>
          <p className="text-sm text-foreground">{answer}</p>
        </div>

        <ScoreDisplay
          clarity={evaluation.clarity_score}
          structure={evaluation.structure_score}
          depth={evaluation.depth_score}
          overall={evaluation.overall_score}
        />

        {isBehavioral && starData && (
          <StarBreakdown
            situation={starData.situation}
            task={starData.task}
            action={starData.action}
            result={starData.result}
            missing_components={starData.missing_components}
            improvement_tips={starData.improvement_tips}
          />
        )}

        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="mb-1 text-sm font-medium text-foreground">Feedback</p>
          <p className="text-sm text-muted">{evaluation.feedback}</p>
        </div>

        <div>
          <button
            onClick={() => setShowSuggested(!showSuggested)}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            {showSuggested ? "Hide stronger answer" : "See a stronger answer"}
          </button>
          {showSuggested && (
            <div className="mt-2 rounded-lg border border-brand-200 bg-brand-50 p-4">
              <p className="text-sm text-foreground">
                {evaluation.suggested_answer}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <Textarea
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={4}
        className="resize-none"
        disabled={loading}
      />
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">
          {answer.length} characters
          {isBehavioral && " — Use STAR format for best results"}
        </span>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Evaluating..." : "Submit Answer"}
        </Button>
      </div>
    </div>
  );
}
