import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HistoryClient } from "./history-client";

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, job_title, company_name, overall_score, status, created_at")
    .order("created_at", { ascending: false });

  return <HistoryClient sessions={sessions || []} />;
}
