"use client";

import { Badge } from "@/components/ui/Badge";
import { AnswerEditor } from "./AnswerEditor";
import type { QuestionType, Difficulty } from "@/types";

interface QuestionCardProps {
  questionId: string;
  index: number;
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  targetSkill: string;
  hasAnswer: boolean;
}

const typeBadgeVariant: Record<QuestionType, "info" | "success" | "warning" | "default"> = {
  behavioral: "info",
  technical: "success",
  situational: "warning",
  general: "default",
};

const difficultyBadgeVariant: Record<Difficulty, "success" | "warning" | "danger"> = {
  easy: "success",
  medium: "warning",
  hard: "danger",
};

export function QuestionCard({
  questionId,
  index,
  questionText,
  questionType,
  difficulty,
  targetSkill,
  hasAnswer,
}: QuestionCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
          {index + 1}
        </span>
        <Badge variant={typeBadgeVariant[questionType]}>{questionType}</Badge>
        <Badge variant={difficultyBadgeVariant[difficulty]}>{difficulty}</Badge>
        <span className="ml-auto text-xs text-muted">{targetSkill}</span>
      </div>
      <p className="text-foreground">{questionText}</p>
      {hasAnswer ? (
        <p className="mt-3 text-sm text-success">Answered</p>
      ) : (
        <AnswerEditor questionId={questionId} />
      )}
    </div>
  );
}
