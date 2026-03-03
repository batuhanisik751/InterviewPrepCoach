"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  User,
  Bell,
  Palette,
  Shield,
  Save,
  Moon,
  Sun,
  Monitor,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";

interface NotificationPrefs {
  email: boolean;
  weekly: boolean;
  tips: boolean;
}

interface SettingsFormProps {
  initialName: string;
  initialEmail: string;
  initialNotifications: NotificationPrefs;
}

export function SettingsForm({
  initialName,
  initialEmail,
  initialNotifications,
}: SettingsFormProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const supabase = createClient();

  const [name, setName] = useState(initialName);
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [notifications, setNotifications] = useState<NotificationPrefs>(initialNotifications);
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [notifMsg, setNotifMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSaveProfile() {
    setSaving(true);
    setProfileMsg(null);

    try {
      const updates: Record<string, unknown> = {
        data: { full_name: name },
      };

      if (newPassword.length > 0) {
        if (newPassword.length < 8) {
          setProfileMsg({ type: "error", text: "Password must be at least 8 characters." });
          setSaving(false);
          return;
        }
        updates.password = newPassword;
      }

      const { error } = await supabase.auth.updateUser(updates);

      if (error) {
        setProfileMsg({ type: "error", text: error.message });
      } else {
        setProfileMsg({ type: "success", text: "Profile updated successfully." });
        setNewPassword("");
      }
    } catch {
      setProfileMsg({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveNotifications(updated: NotificationPrefs) {
    setNotifications(updated);
    setSavingNotifs(true);
    setNotifMsg(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { notification_preferences: updated },
      });

      if (error) {
        setNotifMsg({ type: "error", text: error.message });
      } else {
        setNotifMsg({ type: "success", text: "Preferences saved." });
      }
    } catch {
      setNotifMsg({ type: "error", text: "Failed to save preferences." });
    } finally {
      setSavingNotifs(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      } else {
        setConfirmDelete(false);
        setDeleting(false);
      }
    } catch {
      setConfirmDelete(false);
      setDeleting(false);
    }
  }

  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile" className="gap-2">
          <User className="w-4 h-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="appearance" className="gap-2">
          <Palette className="w-4 h-4" />
          Appearance
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2">
          <Bell className="w-4 h-4" />
          Notifications
        </TabsTrigger>
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={initialEmail}
                disabled
                className="opacity-60"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {profileMsg && (
              <p className={`text-sm ${profileMsg.type === "error" ? "text-destructive" : "text-[#10b981]"}`}>
                {profileMsg.text}
              </p>
            )}
            <Button className="gap-2" onClick={handleSaveProfile} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Appearance Tab */}
      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                    theme === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <option.icon
                    className={`w-5 h-5 ${
                      theme === option.value
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "email" as const,
                label: "Email notifications",
                description: "Get notified about session results",
              },
              {
                key: "weekly" as const,
                label: "Weekly summary",
                description: "Receive a weekly progress report",
              },
              {
                key: "tips" as const,
                label: "Interview tips",
                description:
                  "Get AI-powered interview tips and articles",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-start justify-between gap-4 py-2"
              >
                <div className="space-y-0.5">
                  <Label>{item.label}</Label>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  disabled={savingNotifs}
                  onCheckedChange={(checked) => {
                    const updated = { ...notifications, [item.key]: checked };
                    handleSaveNotifications(updated);
                  }}
                />
              </div>
            ))}
            {notifMsg && (
              <p className={`text-xs ${notifMsg.type === "error" ? "text-destructive" : "text-[#10b981]"}`}>
                {notifMsg.text}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2 font-semibold">
              <Shield className="w-4 h-4" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Permanently delete your account and all data. This action cannot
              be undone.
            </p>
            {!confirmDelete ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Account
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                      Deleting...
                    </>
                  ) : (
                    "Confirm Delete"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
