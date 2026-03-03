"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EndInterviewButtonProps {
  sessionId: string;
}

export function EndInterviewButton({ sessionId }: EndInterviewButtonProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleEndInterview() {
    setSaving(true);
    try {
      // Save whatever answers have been collected so far
      await fetch("/api/mock/save-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      // Navigate regardless of save result (409 = already saved, which is fine)
    } catch {
      // Navigate even if save fails — don't block the user
    } finally {
      router.push(`/session/${sessionId}`);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleEndInterview}
      disabled={saving}
    >
      {saving ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
          Saving...
        </>
      ) : (
        "End Interview"
      )}
    </Button>
  );
}
