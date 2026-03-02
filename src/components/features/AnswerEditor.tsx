"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { ScoreBar } from "@/components/features/score-bar";
import { StarBreakdown } from "@/components/features/StarBreakdown";

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
        {/* User's answer */}
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Your Answer</p>
          <p className="text-sm text-foreground">{answer}</p>
        </div>

        {/* Score bars */}
        <div className="space-y-3">
          <ScoreBar label="Clarity" value={evaluation.clarity_score} weight="25%" />
          <ScoreBar label="Structure" value={evaluation.structure_score} weight="30%" />
          <ScoreBar label="Depth" value={evaluation.depth_score} weight="45%" />
        </div>

        {/* STAR breakdown for behavioral questions */}
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

        {/* Feedback */}
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">AI Feedback</p>
          <p className="text-sm leading-relaxed text-foreground">{evaluation.feedback}</p>
        </div>

        {/* Suggested answer toggle */}
        <div>
          <button
            onClick={() => setShowSuggested(!showSuggested)}
            className="flex items-center gap-2 text-sm font-medium text-[#2563eb] hover:underline"
          >
            {showSuggested ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {showSuggested ? "Hide" : "Show"} Suggested Answer
          </button>
          {showSuggested && (
            <div className="mt-3 bg-[#2563eb]/5 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#2563eb]" />
                <p className="text-sm leading-relaxed text-foreground">
                  {evaluation.suggested_answer}
                </p>
              </div>
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
