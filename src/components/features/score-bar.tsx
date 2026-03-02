import { cn } from "@/lib/utils";

interface ScoreBarProps {
  label: string;
  value: number;
  maxValue?: number;
  weight?: string;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score < 4) return "bg-[#ef4444]";
  if (score <= 7) return "bg-[#f59e0b]";
  return "bg-[#10b981]";
}

function getScoreTextColor(score: number): string {
  if (score < 4) return "text-[#ef4444]";
  if (score <= 7) return "text-[#f59e0b]";
  return "text-[#10b981]";
}

export function ScoreBar({ label, value, maxValue = 10, weight, className }: ScoreBarProps) {
  const percentage = (value / maxValue) * 100;
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {label}
          {weight && <span className="text-muted-foreground font-normal"> ({weight})</span>}
        </span>
        <span className={cn("text-sm font-semibold", getScoreTextColor(value))}>
          {value.toFixed(1)}
        </span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getScoreColor(value))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function ScoreCircle({ score, size = "lg" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-16 h-16 text-xl",
    lg: "w-24 h-24 text-3xl",
  };
  const borderColor = score < 4 ? "border-[#ef4444]" : score <= 7 ? "border-[#f59e0b]" : "border-[#10b981]";
  const textColor = getScoreTextColor(score);

  return (
    <div className={cn("rounded-full border-4 flex items-center justify-center", borderColor, sizeClasses[size])}>
      <span className={cn("font-bold", textColor)}>{score.toFixed(1)}</span>
    </div>
  );
}

export function StatusBadge({ status }: { status: "draft" | "in_progress" | "completed" }) {
  const config = {
    draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
    in_progress: { label: "In Progress", className: "bg-[#f59e0b]/10 text-[#f59e0b]" },
    completed: { label: "Completed", className: "bg-[#10b981]/10 text-[#10b981]" },
  };
  const { label, className } = config[status];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", className)}>
      {label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: "high" | "medium" | "low" }) {
  const config = {
    high: { label: "High", className: "bg-[#ef4444]/10 text-[#ef4444]" },
    medium: { label: "Medium", className: "bg-[#f59e0b]/10 text-[#f59e0b]" },
    low: { label: "Low", className: "bg-[#3b82f6]/10 text-[#3b82f6]" },
  };
  const { label, className } = config[severity];
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", className)}>
      {label}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const config: Record<string, string> = {
    behavioral: "bg-purple-100 text-purple-700",
    technical: "bg-blue-100 text-blue-700",
    situational: "bg-orange-100 text-orange-700",
    general: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize", config[type] || config.general)}>
      {type}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const config: Record<string, string> = {
    easy: "bg-[#10b981]/10 text-[#10b981]",
    medium: "bg-[#f59e0b]/10 text-[#f59e0b]",
    hard: "bg-[#ef4444]/10 text-[#ef4444]",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize", config[difficulty] || "")}>
      {difficulty}
    </span>
  );
}
