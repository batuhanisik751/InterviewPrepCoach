"use client";

import { MessageSquare, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypeBadge, DifficultyBadge } from "@/components/features/score-bar";
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
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
            <span className="text-sm font-medium text-[#10b981]">Answered</span>
          </div>
        ) : (
          <AnswerEditor questionId={questionId} questionType={questionType} />
        )}
      </CardContent>
    </Card>
  );
}
