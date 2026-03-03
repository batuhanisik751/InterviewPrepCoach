"use client";

import { useState } from "react";
import { MockInterview } from "./mock-interview";
import { EndInterviewButton } from "./end-interview-button";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExistingMessage {
  role: "user" | "assistant";
  content: string;
}

interface MockPageContentProps {
  sessionId: string;
  jobTitle: string | null;
  companyName: string | null;
  existingMessages: ExistingMessage[];
}

export function MockPageContent({
  sessionId,
  jobTitle,
  companyName,
  existingMessages,
}: MockPageContentProps) {
  const [resultsSaved, setResultsSaved] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-4 md:-m-6 lg:-m-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-background shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/session/${sessionId}`}>
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Mock Interview
            </p>
            <p className="text-xs text-muted-foreground">
              {jobTitle || "Interview Session"}
              {companyName && ` at ${companyName}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span>Mock Interview</span>
          </div>
          <EndInterviewButton
            sessionId={sessionId}
            resultsSaved={resultsSaved}
          />
        </div>
      </div>

      <MockInterview
        sessionId={sessionId}
        existingMessages={existingMessages}
        onResultsSaved={() => setResultsSaved(true)}
      />
    </div>
  );
}
