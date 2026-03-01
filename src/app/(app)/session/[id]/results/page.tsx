import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { StarBreakdown } from "@/components/features/StarBreakdown";
import { WeakPointsList } from "@/components/features/WeakPointsList";

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
  const { data: answers } = questionIds.length > 0
    ? await supabase
        .from("answers")
        .select("*")
        .in("question_id", questionIds)
    : { data: [] };

  // Fetch all evaluations for these answers
  const answerIds = (answers || []).map((a) => a.id);
  const { data: evaluations } = answerIds.length > 0
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
  const avgClarity = evals.length > 0
    ? evals.reduce((s, e) => s + e.clarity_score, 0) / evals.length
    : 0;
  const avgStructure = evals.length > 0
    ? evals.reduce((s, e) => s + e.structure_score, 0) / evals.length
    : 0;
  const avgDepth = evals.length > 0
    ? evals.reduce((s, e) => s + e.depth_score, 0) / evals.length
    : 0;

  const statusVariant = (status: string) => {
    if (status === "completed") return "success" as const;
    if (status === "in_progress") return "warning" as const;
    return "default" as const;
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {session.job_title || "Session Results"}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            {session.company_name && (
              <span className="text-muted">{session.company_name}</span>
            )}
            <Badge variant={statusVariant(session.status)}>
              {session.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
        <Link href={`/session/${id}`}>
          <Button variant="secondary">Back to Session</Button>
        </Link>
      </div>

      {/* Overall scores */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
        </CardHeader>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="text-center">
            <p className="text-4xl font-bold text-brand-600">
              {session.overall_score !== null
                ? session.overall_score.toFixed(1)
                : "-"}
            </p>
            <p className="text-sm text-muted">Overall Score</p>
          </div>
          <div className="space-y-3">
            <Progress value={Number(avgClarity.toFixed(1))} label="Clarity (25%)" />
            <Progress value={Number(avgStructure.toFixed(1))} label="Structure (30%)" />
            <Progress value={Number(avgDepth.toFixed(1))} label="Depth (45%)" />
          </div>
        </div>
        <p className="mt-4 text-xs text-muted">
          {answeredCount} of {totalQuestions} questions answered
        </p>
      </Card>

      {/* Weak Points */}
      {session.weak_points && session.weak_points.length > 0 && (
        <div className="mb-6">
          <WeakPointsList weakPoints={session.weak_points} />
        </div>
      )}

      {/* Question-by-question breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Question Breakdown</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {(questions || []).map((q, index) => {
            const answer = answersMap.get(q.id);
            const evaluation = answer ? evalsMap.get(answer.id) : null;

            return (
              <div
                key={q.id}
                className="rounded-lg border border-border p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                    {index + 1}
                  </span>
                  <Badge
                    variant={
                      q.question_type === "behavioral"
                        ? "info"
                        : q.question_type === "technical"
                          ? "success"
                          : q.question_type === "situational"
                            ? "warning"
                            : "default"
                    }
                  >
                    {q.question_type}
                  </Badge>
                  {evaluation && (
                    <span className="ml-auto text-sm font-medium text-foreground">
                      {evaluation.overall_score.toFixed(1)}/10
                    </span>
                  )}
                  {!answer && (
                    <span className="ml-auto text-xs text-muted">
                      Unanswered
                    </span>
                  )}
                </div>

                <p className="mb-2 text-sm text-foreground">
                  {q.question_text}
                </p>

                {evaluation && (
                  <div className="mt-3 space-y-2 border-t border-border pt-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">
                          {evaluation.clarity_score.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted">Clarity</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">
                          {evaluation.structure_score.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted">Structure</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">
                          {evaluation.depth_score.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted">Depth</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted">{evaluation.feedback}</p>

                    {/* STAR breakdown for behavioral questions */}
                    {evaluation.star_detected && evaluation.star_breakdown && (
                      <div className="mt-2">
                        <StarBreakdown {...evaluation.star_breakdown} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
