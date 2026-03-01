import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MockInterview } from "./mock-interview";

interface MockPageProps {
  params: Promise<{ id: string }>;
}

export default async function MockPage({ params }: MockPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("sessions")
    .select("id, job_title, company_name, resume_text, job_description")
    .eq("id", id)
    .single();

  if (!session) {
    notFound();
  }

  // Load existing mock messages for this session
  const { data: existingMessages } = await supabase
    .from("mock_messages")
    .select("role, content, created_at")
    .eq("session_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-3xl flex-col">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Mock Interview
          </h1>
          <p className="text-sm text-muted">
            {session.job_title || "Interview Session"}
            {session.company_name && ` at ${session.company_name}`}
          </p>
        </div>
        <a
          href={`/session/${id}`}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:bg-surface-secondary"
        >
          Back to Session
        </a>
      </div>

      <MockInterview
        sessionId={id}
        existingMessages={
          existingMessages?.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })) || []
        }
      />
    </div>
  );
}
