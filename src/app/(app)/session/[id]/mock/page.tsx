import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MockPageContent } from "./mock-page-content";

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
    <MockPageContent
      sessionId={id}
      jobTitle={session.job_title}
      companyName={session.company_name}
      existingMessages={
        existingMessages?.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })) || []
      }
    />
  );
}
