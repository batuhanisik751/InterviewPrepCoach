import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
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

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {session.job_title || "Interview Session"}
          </h1>
          {session.company_name && (
            <p className="mt-1 text-muted">{session.company_name}</p>
          )}
        </div>
        {session.status === "completed" && (
          <Link href={`/session/${id}/results`}>
            <Button variant="secondary">View Results</Button>
          </Link>
        )}
      </div>

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
