import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    user?.user_metadata?.full_name || user?.email || "there";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome, {name}!
        </h1>
        <p className="mt-2 text-muted">
          Your dashboard is coming soon. This is a placeholder for Phase 4.
        </p>
        <LogoutButton />
      </div>
    </div>
  );
}
