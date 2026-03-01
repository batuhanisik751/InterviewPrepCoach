import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
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

  // Fetch existing questions if any
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("session_id", id)
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {session.job_title || "Interview Session"}
        </h1>
        {session.company_name && (
          <p className="mt-1 text-muted">{session.company_name}</p>
        )}
      </div>

      <SessionQuestions
        sessionId={id}
        initialStatus={session.status}
        initialQuestions={questions || []}
      />
    </div>
  );
}
