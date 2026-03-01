import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col items-start">
          <CardTitle>New Session</CardTitle>
          <CardDescription className="mb-4">
            Paste your resume and a job description to generate tailored
            interview questions.
          </CardDescription>
          <Link href="/session/new" className="mt-auto">
            <Button>Start Prep</Button>
          </Link>
        </Card>

        <Card className="flex flex-col items-start">
          <CardTitle>History</CardTitle>
          <CardDescription className="mb-4">
            Review past sessions, scores, and suggested improvements.
          </CardDescription>
          <Link href="/history" className="mt-auto">
            <Button variant="secondary">View History</Button>
          </Link>
        </Card>

        <Card className="flex flex-col items-start">
          <CardTitle>Settings</CardTitle>
          <CardDescription className="mb-4">
            Manage your profile and preferences.
          </CardDescription>
          <Link href="/settings" className="mt-auto">
            <Button variant="ghost">Open Settings</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
