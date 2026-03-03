"use client";

import { useState, useRef, useEffect } from "react";
import {
  CheckCircle2,
  MinusCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TypeBadge, DifficultyBadge, ScoreBar } from "@/components/features/score-bar";
import { AnswerEditor } from "./AnswerEditor";
import type { QuestionType, Difficulty } from "@/types";

export interface EvaluationData {
  clarity_score: number;
  structure_score: number;
  depth_score: number;
  overall_score: number;
  feedback: string;
  suggested_answer: string;
}

function getScoreColor(score: number): string {
  if (score < 4) return "text-[#ef4444]";
  if (score <= 7) return "text-[#f59e0b]";
  return "text-[#10b981]";
}

interface QuestionCardProps {
  questionId: string;
  index: number;
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  targetSkill: string;
  hasAnswer: boolean;
  evaluation?: EvaluationData | null;
  onAnswerSubmitted?: (questionId: string, evaluation: EvaluationData) => void;
  sessionStatus?: string;
}

export function QuestionCard({
  questionId,
  index,
  questionText,
  questionType,
  difficulty,
  targetSkill,
  hasAnswer,
  evaluation,
  onAnswerSubmitted,
  sessionStatus,
}: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const prevHasAnswer = useRef(hasAnswer);

  // Auto-expand when a fresh answer is submitted (transition from unanswered to answered)
  useEffect(() => {
    if (!prevHasAnswer.current && hasAnswer && evaluation) {
      setExpanded(true);
    }
    prevHasAnswer.current = hasAnswer;
  }, [hasAnswer, evaluation]);

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground">
              Q{index + 1}
            </span>
            <TypeBadge type={questionType} />
            <DifficultyBadge difficulty={difficulty} />
            <span className="ml-auto text-xs text-muted-foreground">
              {targetSkill}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground">{questionText}</p>
        </div>

        {hasAnswer ? (
          <div className="pt-2 border-t border-border">
            <button
              onClick={() => evaluation && setExpanded(!expanded)}
              className="flex items-center gap-2 w-full text-left"
            >
              <CheckCircle2 className="h-4 w-4 text-[#10b981] shrink-0" />
              <span className="text-sm font-medium text-[#10b981]">
                Answered
              </span>
              {evaluation && (
                <span className="ml-auto flex items-center gap-2">
                  <span
                    className={`text-sm font-bold ${getScoreColor(evaluation.overall_score)}`}
                  >
                    {evaluation.overall_score.toFixed(1)}
                  </span>
                  {expanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </span>
              )}
            </button>

            {expanded && evaluation && (
              <div className="mt-4 space-y-4">
                {/* Score bars */}
                <div className="space-y-3">
                  <ScoreBar
                    label="Clarity"
                    value={evaluation.clarity_score}
                    weight="25%"
                  />
                  <ScoreBar
                    label="Structure"
                    value={evaluation.structure_score}
                    weight="30%"
                  />
                  <ScoreBar
                    label="Depth"
                    value={evaluation.depth_score}
                    weight="45%"
                  />
                </div>

                {/* AI Feedback */}
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">
                    AI Feedback
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">
                    {evaluation.feedback}
                  </p>
                </div>

                {/* Suggested Answer */}
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSuggested(!showSuggested);
                    }}
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
            )}
          </div>
        ) : sessionStatus === "completed" ? (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <MinusCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground italic">
              Not asked in mock interview
            </span>
          </div>
        ) : (
          <AnswerEditor
            questionId={questionId}
            questionType={questionType}
            onAnswerSubmitted={(evalData) =>
              onAnswerSubmitted?.(questionId, evalData)
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
