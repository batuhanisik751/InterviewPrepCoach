import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Download,
  RotateCcw,
  Trophy,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ScoreBar,
  ScoreCircle,
  SeverityBadge,
  TypeBadge,
  DifficultyBadge,
} from "@/components/features/score-bar";
import { StarBreakdown } from "@/components/features/StarBreakdown";
import { WeakPointsList } from "@/components/features/WeakPointsList";
import { QuestionResultAccordion } from "./question-result-accordion";

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (!session) {
    notFound();
  }

  // Fetch questions with answers and evaluations
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("session_id", id)
    .order("sort_order", { ascending: true });

  // Fetch all answers for these questions
  const questionIds = (questions || []).map((q) => q.id);
  const { data: answers } =
    questionIds.length > 0
      ? await supabase
          .from("answers")
          .select("*")
          .in("question_id", questionIds)
      : { data: [] };

  // Fetch all evaluations for these answers
  const answerIds = (answers || []).map((a) => a.id);
  const { data: evaluations } =
    answerIds.length > 0
      ? await supabase
          .from("evaluations")
          .select("*")
          .in("answer_id", answerIds)
      : { data: [] };

  const answersMap = new Map((answers || []).map((a) => [a.question_id, a]));
  const evalsMap = new Map((evaluations || []).map((e) => [e.answer_id, e]));

  const totalQuestions = (questions || []).length;
  const answeredCount = (answers || []).length;

  // Compute average scores
  const evals = evaluations || [];
  const avgClarity =
    evals.length > 0
      ? evals.reduce((s, e) => s + e.clarity_score, 0) / evals.length
      : 0;
  const avgStructure =
    evals.length > 0
      ? evals.reduce((s, e) => s + e.structure_score, 0) / evals.length
      : 0;
  const avgDepth =
    evals.length > 0
      ? evals.reduce((s, e) => s + e.depth_score, 0) / evals.length
      : 0;

  // Build serializable question data for the client accordion
  const questionBreakdown = (questions || []).map((q, index) => {
    const answer = answersMap.get(q.id);
    const evaluation = answer ? evalsMap.get(answer.id) : null;

    return {
      id: q.id,
      number: index + 1,
      questionText: q.question_text,
      questionType: q.question_type,
      difficulty: q.difficulty,
      targetSkill: q.target_skill,
      answer: answer
        ? {
            text: answer.answer_text,
          }
        : null,
      evaluation: evaluation
        ? {
            overallScore: evaluation.overall_score,
            clarityScore: evaluation.clarity_score,
            structureScore: evaluation.structure_score,
            depthScore: evaluation.depth_score,
            feedback: evaluation.feedback,
            starDetected: evaluation.star_detected,
            starBreakdown: evaluation.star_breakdown,
          }
        : null,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/session/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Session Results
            </h1>
            <p className="text-muted-foreground text-sm">
              {session.job_title || "Interview Session"}
              {session.company_name && ` -- ${session.company_name}`}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Link href="/session/new">
            <Button className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Practice Again
            </Button>
          </Link>
        </div>
      </div>

      {/* Overall Score Hero */}
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center">
              <div className="relative">
                <ScoreCircle
                  score={session.overall_score ?? 0}
                  size="lg"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#f59e0b]/10 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-[#f59e0b]" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-3">
                Overall Score
              </p>
            </div>
            <div className="flex-1 w-full space-y-4">
              <ScoreBar
                label="Clarity"
                value={Number(avgClarity.toFixed(1))}
                weight="25%"
              />
              <ScoreBar
                label="Structure"
                value={Number(avgStructure.toFixed(1))}
                weight="30%"
              />
              <ScoreBar
                label="Depth"
                value={Number(avgDepth.toFixed(1))}
                weight="45%"
              />
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground text-center md:text-left">
            {answeredCount} of {totalQuestions} questions answered
          </p>
        </CardContent>
      </Card>

      {/* Gap Analysis */}
      {session.weak_points && session.weak_points.length > 0 && (
        <div>
          <h2 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
            Identified Gaps
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {session.weak_points.slice(0, 4).map(
              (
                wp: {
                  skill: string;
                  severity: "high" | "medium" | "low";
                  suggestion: string;
                },
                idx: number
              ) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-foreground">
                        {wp.skill}
                      </span>
                      <SeverityBadge severity={wp.severity} />
                    </div>
                    <div className="bg-[#2563eb]/5 rounded-lg p-3 mt-2">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-[#2563eb] mt-0.5 shrink-0" />
                        <p className="text-xs text-foreground leading-relaxed">
                          {wp.suggestion}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      )}

      {/* Question-by-Question Breakdown */}
      <div>
        <h2 className="text-foreground mb-4 text-lg font-semibold">
          Question-by-Question Breakdown
        </h2>
        <QuestionResultAccordion questions={questionBreakdown} />
      </div>
    </div>
  );
}
