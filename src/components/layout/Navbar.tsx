"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  userName: string;
  onMenuToggle: () => void;
}

export function Navbar({ userName, onMenuToggle }: NavbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      <button
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-muted hover:bg-surface-secondary lg:hidden"
        aria-label="Toggle menu"
      >
        |||
      </button>

      <div className="flex-1" />

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-surface-secondary"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline">{userName}</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-surface py-1 shadow-lg">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-surface-secondary"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
