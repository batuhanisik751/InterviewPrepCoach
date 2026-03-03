import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/features/score-bar";
import { SessionQuestions } from "./session-questions";

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
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

  // Fetch existing questions
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("session_id", id)
    .order("sort_order", { ascending: true });

  // Fetch answers with their evaluations
  const questionIds = (questions || []).map((q) => q.id);
  let answeredQuestionIds: string[] = [];
  let initialEvaluations: Record<
    string,
    {
      clarity_score: number;
      structure_score: number;
      depth_score: number;
      overall_score: number;
      feedback: string;
      suggested_answer: string;
    }
  > = {};

  if (questionIds.length > 0) {
    const { data: answersData } = await supabase
      .from("answers")
      .select(
        "question_id, evaluations(clarity_score, structure_score, depth_score, overall_score, feedback, suggested_answer)"
      )
      .in("question_id", questionIds);

    answeredQuestionIds = (answersData || []).map((a) => a.question_id);

    for (const a of answersData || []) {
      const evals = a.evaluations;
      if (Array.isArray(evals) && evals.length > 0) {
        initialEvaluations[a.question_id] = evals[0];
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Session header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {session.job_title || "Interview Session"}
            </h1>
            <StatusBadge
              status={
                session.status as "draft" | "in_progress" | "completed"
              }
            />
          </div>
          {session.company_name && (
            <p className="text-muted-foreground text-sm">
              {session.company_name} &middot; Created{" "}
              {new Date(session.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Link href={`/session/${id}/mock`}>
            <Button className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Mock Interview
            </Button>
          </Link>
          {session.status === "completed" && (
            <Link href={`/session/${id}/results`}>
              <Button variant="outline" className="gap-2">
                Results
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <SessionQuestions
        sessionId={id}
        initialStatus={session.status}
        initialQuestions={questions || []}
        answeredQuestionIds={answeredQuestionIds}
        initialWeakPoints={session.weak_points}
        initialEvaluations={initialEvaluations}
      />
    </div>
  );
}
