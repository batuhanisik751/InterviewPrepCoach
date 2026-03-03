import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = (user.user_metadata?.full_name as string) || "";
  const email = user.email || "";
  const notificationPrefs = user.user_metadata?.notification_preferences || {
    email: true,
    weekly: true,
    tips: false,
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and preferences.
        </p>
      </div>

      <SettingsForm
        initialName={fullName}
        initialEmail={email}
        initialNotifications={notificationPrefs}
      />
    </div>
  );
}
