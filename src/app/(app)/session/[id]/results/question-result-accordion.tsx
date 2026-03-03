"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ScoreBar,
  ScoreCircle,
  TypeBadge,
  DifficultyBadge,
} from "@/components/features/score-bar";

interface StarItem {
  present: boolean;
  score: number;
  snippet?: string;
}

interface StarBreakdownData {
  situation: StarItem;
  task: StarItem;
  action: StarItem;
  result: StarItem;
  tips?: string;
}

interface QuestionData {
  id: string;
  number: number;
  questionText: string;
  questionType: string;
  difficulty: string;
  targetSkill: string;
  answer: {
    text: string;
  } | null;
  evaluation: {
    overallScore: number;
    clarityScore: number;
    structureScore: number;
    depthScore: number;
    feedback: string;
    starDetected: boolean;
    starBreakdown: StarBreakdownData | null;
  } | null;
}

interface QuestionResultAccordionProps {
  questions: QuestionData[];
}

function QuestionResultItem({ question }: { question: QuestionData }) {
  const [expanded, setExpanded] = useState(false);

  if (!question.answer || !question.evaluation) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-sm font-semibold text-muted-foreground">
              {question.number}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <TypeBadge type={question.questionType} />
                <DifficultyBadge difficulty={question.difficulty} />
              </div>
              <p className="text-sm font-medium text-foreground">
                {question.questionText}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Unanswered</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { evaluation } = question;

  return (
    <Card>
      <CardContent className="p-5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-start justify-between gap-3 text-left"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-sm font-semibold text-muted-foreground">
              {question.number}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <TypeBadge type={question.questionType} />
                <DifficultyBadge difficulty={question.difficulty} />
              </div>
              <p className="text-sm font-medium text-foreground">
                {question.questionText}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <ScoreCircle score={evaluation.overallScore} size="sm" />
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {/* User's answer */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Your Answer
              </p>
              <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3 leading-relaxed">
                {question.answer!.text}
              </p>
            </div>

            {/* Score bars */}
            <div className="space-y-3">
              <ScoreBar
                label="Clarity"
                value={evaluation.clarityScore}
                weight="25%"
              />
              <ScoreBar
                label="Structure"
                value={evaluation.structureScore}
                weight="30%"
              />
              <ScoreBar
                label="Depth"
                value={evaluation.depthScore}
                weight="45%"
              />
            </div>

            {/* STAR for behavioral */}
            {evaluation.starDetected && evaluation.starBreakdown && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  STAR Breakdown
                </p>
                <div className="grid gap-2">
                  {(
                    ["situation", "task", "action", "result"] as const
                  ).map((key) => {
                    const item = evaluation.starBreakdown![key];
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          className={
                            item.present
                              ? "text-[#10b981]"
                              : "text-[#ef4444]"
                          }
                        >
                          {item.present ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                        </span>
                        <span className="capitalize font-medium text-foreground">
                          {key}
                        </span>
                        <span className="text-muted-foreground">
                          -- {item.score}/10
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feedback */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                AI Feedback
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {evaluation.feedback}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function QuestionResultAccordion({
  questions,
}: QuestionResultAccordionProps) {
  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <QuestionResultItem key={q.id} question={q} />
      ))}
    </div>
  );
}
