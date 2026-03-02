import { GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MockChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function MockChatBubble({ role, content, isStreaming }: MockChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 max-w-2xl", isUser && "ml-auto flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-muted" : "bg-[#2563eb]/10"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-muted-foreground" />
        ) : (
          <GraduationCap className="h-4 w-4 text-[#2563eb]" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-lg px-4 py-3",
          isUser
            ? "rounded-2xl rounded-tr-md bg-primary text-primary-foreground"
            : "rounded-2xl rounded-tl-md bg-card border border-border text-foreground"
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {content}
          {isStreaming && !content && (
            <span className="flex gap-1.5">
              <span
                className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </span>
          )}
          {isStreaming && content && (
            <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-current" />
          )}
        </p>
      </div>
    </div>
  );
}
