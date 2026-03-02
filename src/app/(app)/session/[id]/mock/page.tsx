import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-4 md:-m-6 lg:-m-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-background shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/session/${id}`}>
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Mock Interview
            </p>
            <p className="text-xs text-muted-foreground">
              {session.job_title || "Interview Session"}
              {session.company_name && ` at ${session.company_name}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span>Mock Interview</span>
          </div>
          <Link href={`/session/${id}`}>
            <Button variant="outline" size="sm">
              End Interview
            </Button>
          </Link>
        </div>
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
