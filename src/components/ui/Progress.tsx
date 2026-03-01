import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

function getColor(percent: number) {
  if (percent <= 30) return "bg-danger";
  if (percent <= 60) return "bg-warning";
  return "bg-success";
}

export function Progress({ value, max = 10, label, className }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-foreground">{label}</span>
          <span className="font-medium text-foreground">
            {value}/{max}
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-tertiary">
        <div
          className={cn("h-full rounded-full transition-all", getColor(percent))}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
