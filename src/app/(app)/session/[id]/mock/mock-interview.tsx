"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { MockChatBubble } from "@/components/features/MockChatBubble";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
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
  const lastAssistantText = lastAssistantMessage?.parts
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
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="mb-2 text-lg font-medium text-foreground">
            Ready for your mock interview?
          </p>
          <p className="mb-6 text-sm text-muted">
            An AI interviewer will ask you behavioral and situational questions
            based on your resume and the job description. The interview will last
            3-4 questions.
          </p>
          <Button onClick={handleStart}>Start Mock Interview</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto py-4">
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
          <div className="flex items-center gap-2 px-11">
            <Spinner size="sm" />
            <span className="text-xs text-muted">Interviewer is thinking...</span>
          </div>
        )}
      </div>

      {isComplete ? (
        <div className="border-t border-border py-4 text-center">
          <p className="mb-2 text-sm font-medium text-success">
            Mock interview completed!
          </p>
          <a
            href={`/session/${sessionId}`}
            className="text-sm text-brand-600 hover:underline"
          >
            Back to session
          </a>
        </div>
      ) : (
        <form
          onSubmit={handleSend}
          className="flex gap-2 border-t border-border pt-4"
        >
          <textarea
            ref={inputRef}
            rows={2}
            placeholder="Type your answer..."
            disabled={isLoading}
            className="flex-1 resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : "Send"}
          </Button>
        </form>
      )}
    </>
  );
}
