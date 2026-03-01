import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DashboardChart } from "./dashboard-chart";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  // Fetch recent sessions (last 5)
  const { data: recentSessions } = await supabase
    .from("sessions")
    .select("id, job_title, company_name, overall_score, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch completed sessions for the chart (last 10)
  const { data: chartSessions } = await supabase
    .from("sessions")
    .select("job_title, overall_score, created_at")
    .eq("status", "completed")
    .not("overall_score", "is", null)
    .order("created_at", { ascending: true })
    .limit(10);

  const sessions = recentSessions || [];
  const completedCount = sessions.filter((s) => s.status === "completed").length;
  const avgScore =
    sessions
      .filter((s) => s.overall_score !== null)
      .reduce((sum, s) => sum + (s.overall_score ?? 0), 0) /
      (sessions.filter((s) => s.overall_score !== null).length || 1);

  const chartData = (chartSessions || []).map((s, i) => ({
    label: s.job_title || `Session ${i + 1}`,
    score: s.overall_score ?? 0,
  }));

  const statusVariant = (status: string) => {
    if (status === "completed") return "success" as const;
    if (status === "in_progress") return "warning" as const;
    return "default" as const;
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {name}!
        </h1>
        <p className="mt-1 text-muted">
          Start a new session or review your past interviews.
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-600">
            {sessions.length}
          </p>
          <p className="text-sm text-muted">Total Sessions</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-success">
            {completedCount}
          </p>
          <p className="text-sm text-muted">Completed</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-foreground">
            {avgScore > 0 ? avgScore.toFixed(1) : "-"}
          </p>
          <p className="text-sm text-muted">Avg Score</p>
        </Card>
      </div>

      {/* Score trend chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Score Trend</CardTitle>
        </CardHeader>
        <DashboardChart data={chartData} />
      </Card>

      {/* Recent sessions */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Sessions</CardTitle>
            <Link href="/history">
              <Button variant="ghost" className="text-xs">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>

        {sessions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="mb-4 text-muted">
              No sessions yet. Start your first interview prep!
            </p>
            <Link href="/session/new">
              <Button>Start First Session</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/session/${session.id}`}
                className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-surface-secondary"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {session.job_title || "Untitled Session"}
                  </p>
                  <p className="text-xs text-muted">
                    {session.company_name || "No company"} ·{" "}
                    {new Date(session.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {session.overall_score !== null && (
                    <span className="text-sm font-medium text-foreground">
                      {session.overall_score.toFixed(1)}/10
                    </span>
                  )}
                  <Badge variant={statusVariant(session.status)}>
                    {session.status.replace("_", " ")}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Quick start CTA */}
      <Card className="text-center">
        <p className="mb-2 text-lg font-medium text-foreground">
          Ready for your next session?
        </p>
        <p className="mb-4 text-sm text-muted">
          Paste your resume and a job description to get personalized interview prep.
        </p>
        <Link href="/session/new">
          <Button>New Session</Button>
        </Link>
      </Card>
    </div>
  );
}
