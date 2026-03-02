import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Fetch which questions have been answered
  const questionIds = (questions || []).map((q) => q.id);
  const answeredQuestionIds =
    questionIds.length > 0
      ? await supabase
          .from("answers")
          .select("question_id")
          .in("question_id", questionIds)
          .then(({ data }) => (data || []).map((a) => a.question_id))
      : [];

  const totalQuestions = (questions || []).length;
  const answeredCount = answeredQuestionIds.length;
  const progressPercent =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

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

      {/* Progress bar */}
      {totalQuestions > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563eb] rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {answeredCount}/{totalQuestions} answered
          </span>
        </div>
      )}

      <SessionQuestions
        sessionId={id}
        initialStatus={session.status}
        initialQuestions={questions || []}
        answeredQuestionIds={answeredQuestionIds}
        initialWeakPoints={session.weak_points}
      />
    </div>
  );
}
