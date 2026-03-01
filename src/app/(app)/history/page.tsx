import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, job_title, company_name, overall_score, status, created_at")
    .order("created_at", { ascending: false });

  const allSessions = sessions || [];

  const statusVariant = (status: string) => {
    if (status === "completed") return "success" as const;
    if (status === "in_progress") return "warning" as const;
    return "default" as const;
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">History</h1>
          <p className="mt-1 text-muted">
            Your past interview prep sessions.
          </p>
        </div>
        <Link href="/session/new">
          <Button>New Session</Button>
        </Link>
      </div>

      {allSessions.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="mb-4 text-muted">
            No sessions yet. Start a new session to begin!
          </p>
          <Link href="/session/new">
            <Button>Start First Session</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
                  Session
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allSessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">
                      {session.job_title || "Untitled Session"}
                    </p>
                    {session.company_name && (
                      <p className="text-xs text-muted">
                        {session.company_name}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {new Date(session.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {session.overall_score !== null
                      ? `${session.overall_score.toFixed(1)}/10`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(session.status)}>
                      {session.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/session/${session.id}`}>
                      <Button variant="ghost" className="text-xs">
                        {session.status === "completed" ? "Results" : "Continue"}
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
