import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Flame,
  PlusCircle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/features/score-bar";
import { DashboardChart } from "./dashboard-chart";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  // Fetch recent sessions (last 5) for the list
  const { data: recentSessions } = await supabase
    .from("sessions")
    .select("id, job_title, company_name, overall_score, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch all-time stats
  const { count: totalSessionCount } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true });

  const { count: totalCompletedCount } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  const { data: allScoredSessions } = await supabase
    .from("sessions")
    .select("overall_score")
    .not("overall_score", "is", null);

  // Fetch completed session dates for streak calculation
  const { data: completedDates } = await supabase
    .from("sessions")
    .select("created_at")
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  // Fetch completed sessions for the chart (last 10)
  const { data: chartSessions } = await supabase
    .from("sessions")
    .select("job_title, overall_score, created_at")
    .eq("status", "completed")
    .not("overall_score", "is", null)
    .order("created_at", { ascending: true })
    .limit(10);

  const sessions = recentSessions || [];
  const completedCount = totalCompletedCount ?? 0;
  const scored = allScoredSessions || [];
  const avgScore =
    scored.length > 0
      ? scored.reduce((sum, s) => sum + (s.overall_score ?? 0), 0) / scored.length
      : 0;

  // Calculate consecutive day streak
  function calculateStreak(dates: { created_at: string }[]): number {
    if (!dates || dates.length === 0) return 0;
    const uniqueDays = new Set(
      dates.map((d) => new Date(d.created_at).toISOString().split("T")[0])
    );
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().split("T")[0];
    if (!uniqueDays.has(today) && !uniqueDays.has(yesterday)) return 0;
    let streak = 0;
    let checkDate = new Date(uniqueDays.has(today) ? today : yesterday);
    while (uniqueDays.has(checkDate.toISOString().split("T")[0])) {
      streak++;
      checkDate = new Date(checkDate.getTime() - 86_400_000);
    }
    return streak;
  }

  const dayStreak = calculateStreak(completedDates || []);

  const chartData = (chartSessions || []).map((s, i) => ({
    label: s.job_title || `Session ${i + 1}`,
    score: s.overall_score ?? 0,
  }));

  const stats = [
    {
      label: "Total Sessions",
      value: String(totalSessionCount ?? 0),
      icon: BarChart3,
      color: "text-[#2563eb]",
      bg: "bg-[#2563eb]/10",
    },
    {
      label: "Completed",
      value: String(completedCount),
      icon: CheckCircle2,
      color: "text-[#10b981]",
      bg: "bg-[#10b981]/10",
    },
    {
      label: "Avg Score",
      value: avgScore > 0 ? avgScore.toFixed(1) : "-",
      icon: TrendingUp,
      color: "text-[#f59e0b]",
      bg: "bg-[#f59e0b]/10",
    },
    {
      label: "Day Streak",
      value: String(dayStreak),
      icon: Flame,
      color: "text-[#ef4444]",
      bg: "bg-[#ef4444]/10",
    },
  ];

  function scoreColor(score: number) {
    if (score >= 7) return "text-[#10b981]";
    if (score >= 4) return "text-[#f59e0b]";
    return "text-[#ef4444]";
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {name}!
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            You&apos;ve completed {completedCount} practice session
            {completedCount !== 1 ? "s" : ""}. Keep going!
          </p>
        </div>
        <Link href="/session/new">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            New Session
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}
                >
                  <stat.icon className={`w-[18px] h-[18px] ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Score trend chart */}
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardChart data={chartData} />
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="font-semibold">Recent Sessions</CardTitle>
          <Link
            href="/history"
            className="text-sm text-[#2563eb] hover:underline flex items-center gap-1 font-medium"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="mb-4 text-muted-foreground">
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
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="hidden sm:flex w-10 h-10 rounded-lg bg-muted items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {session.job_title || "Untitled Session"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.company_name || "No company"} &middot;{" "}
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {session.overall_score !== null && (
                      <span
                        className={`text-sm font-semibold ${scoreColor(session.overall_score)}`}
                      >
                        {session.overall_score.toFixed(1)}
                      </span>
                    )}
                    <StatusBadge
                      status={
                        session.status as "draft" | "in_progress" | "completed"
                      }
                    />
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
