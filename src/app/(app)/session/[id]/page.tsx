import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

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

      <div className="rounded-xl border border-border bg-surface p-12 text-center">
        <p className="text-muted">
          Question generation coming in Phase 6.
        </p>
      </div>
    </div>
  );
}
