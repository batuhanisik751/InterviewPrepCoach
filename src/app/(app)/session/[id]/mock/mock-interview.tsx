"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, useCallback } from "react";
import { Send, GraduationCap, User, Loader2 } from "lucide-react";
import { MockChatBubble } from "@/components/features/MockChatBubble";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { UIMessage } from "ai";

interface ExistingMessage {
  role: "user" | "assistant";
  content: string;
}

interface MockInterviewProps {
  sessionId: string;
  existingMessages: ExistingMessage[];
}

export function MockInterview({
  sessionId,
  existingMessages,
}: MockInterviewProps) {
  const [started, setStarted] = useState(existingMessages.length > 0);
  const [savingResults, setSavingResults] = useState(false);
  const [resultsSaved, setResultsSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    id: `mock-${sessionId}`,
    transport: new DefaultChatTransport({
      api: "/api/mock/chat",
      body: { sessionId },
    }),
    messages: existingMessages.map((m, i) => ({
      id: `existing-${i}`,
      role: m.role,
      parts: [{ type: "text" as const, text: m.content }],
      createdAt: new Date(),
    })) as UIMessage[],
  });

  const isStreaming = status === "streaming";
  const isSubmitting = status === "submitted";
  const isLoading = isStreaming || isSubmitting;

  // Check if interview is complete
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const lastAssistantText =
    lastAssistantMessage?.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") || "";
  const isComplete = lastAssistantText.includes(
    "Thank you for completing this mock interview"
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Save results when interview completes
  const saveResults = useCallback(async () => {
    if (savingResults || resultsSaved) return;
    setSavingResults(true);
    setSaveError(false);
    try {
      const res = await fetch("/api/mock/save-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok || res.status === 409) {
        // 409 means answers already saved — treat as success
        setResultsSaved(true);
      } else {
        setSaveError(true);
      }
    } catch {
      setSaveError(true);
    } finally {
      setSavingResults(false);
    }
  }, [sessionId, savingResults, resultsSaved]);

  useEffect(() => {
    if (isComplete && !resultsSaved && !savingResults) {
      saveResults();
    }
  }, [isComplete, resultsSaved, savingResults, saveResults]);

  async function handleStart() {
    setStarted(true);
    await sendMessage({
      text: "I'm ready to begin the mock interview. Please start.",
    });
  }

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const textarea = inputRef.current;
    if (!textarea || !textarea.value.trim() || isLoading) return;

    const text = textarea.value.trim();
    textarea.value = "";

    // Persist the user message
    fetch("/api/mock/chat/persist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        role: "user",
        content: text,
      }),
    }).catch(() => {});

    await sendMessage({ text });
  }

  function getMessageText(message: UIMessage): string {
    return (
      message.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") || ""
    );
  }

  if (!started) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <div className="rounded-xl border border-border bg-card p-8 text-center max-w-md">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb]/10">
            <GraduationCap className="h-6 w-6 text-[#2563eb]" />
          </div>
          <p className="mb-2 text-lg font-medium text-foreground">
            Ready for your mock interview?
          </p>
          <p className="mb-6 text-sm text-muted-foreground">
            An AI interviewer will ask you behavioral and situational questions
            based on your resume and the job description. The interview will last
            3-4 questions.
          </p>
          <Button onClick={handleStart} className="gap-2">
            Start Mock Interview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4"
      >
        {messages.map((message) => {
          if (message.role !== "user" && message.role !== "assistant") {
            return null;
          }
          const text = getMessageText(message);
          if (!text) return null;

          return (
            <MockChatBubble
              key={message.id}
              role={message.role}
              content={text}
              isStreaming={
                isStreaming &&
                message === messages[messages.length - 1] &&
                message.role === "assistant"
              }
            />
          );
        })}

        {isSubmitting && (
          <div className="flex gap-3 max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-[#2563eb]/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-[#2563eb]" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span
                  className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      {isComplete ? (
        <div className="border-t border-border py-4 text-center bg-background shrink-0">
          <p className="mb-2 text-sm font-medium text-[#10b981]">
            Mock interview completed!
          </p>
          {savingResults && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving and evaluating your answers...
            </div>
          )}
          {resultsSaved && (
            <div className="flex flex-col items-center gap-2">
              <a
                href={`/session/${sessionId}/results`}
                className="text-sm text-[#2563eb] hover:underline font-medium"
              >
                View Results & Export PDF
              </a>
              <a
                href={`/session/${sessionId}`}
                className="text-xs text-muted-foreground hover:underline"
              >
                Back to session
              </a>
            </div>
          )}
          {saveError && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">
                Could not save results automatically.
              </p>
              <a
                href={`/session/${sessionId}`}
                className="text-sm text-[#2563eb] hover:underline"
              >
                Back to session
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="border-t border-border px-4 md:px-6 py-3 bg-background shrink-0">
          <form
            onSubmit={handleSend}
            className="max-w-2xl mx-auto flex gap-3"
          >
            <textarea
              ref={inputRef}
              rows={1}
              placeholder="Type your response..."
              disabled={isLoading}
              className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563eb]/50 focus:border-[#2563eb] disabled:opacity-50"
              style={{ minHeight: "44px", maxHeight: "120px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading}
              size="icon"
              className="shrink-0 self-end h-11 w-11 rounded-xl"
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
