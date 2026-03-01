import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { WeakPoint } from "@/types";

interface WeakPointsListProps {
  weakPoints: WeakPoint[];
}

const severityConfig = {
  high: { label: "High", variant: "danger" as const },
  medium: { label: "Medium", variant: "warning" as const },
  low: { label: "Low", variant: "info" as const },
};

export function WeakPointsList({ weakPoints }: WeakPointsListProps) {
  if (weakPoints.length === 0) {
    return null;
  }

  const sorted = [...weakPoints].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.gap_severity] - order[b.gap_severity];
  });

  const highCount = weakPoints.filter((w) => w.gap_severity === "high").length;
  const mediumCount = weakPoints.filter((w) => w.gap_severity === "medium").length;
  const lowCount = weakPoints.filter((w) => w.gap_severity === "low").length;

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Weak Points Analysis
        </p>
        <div className="flex gap-2 text-xs text-muted">
          {highCount > 0 && (
            <span className="text-danger">{highCount} high</span>
          )}
          {mediumCount > 0 && (
            <span className="text-warning">{mediumCount} medium</span>
          )}
          {lowCount > 0 && (
            <span className="text-info">{lowCount} low</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map((wp, index) => {
          const config = severityConfig[wp.gap_severity];
          return (
            <div
              key={index}
              className={cn(
                "rounded-lg border p-3",
                wp.gap_severity === "high"
                  ? "border-danger/20 bg-danger/5"
                  : wp.gap_severity === "medium"
                    ? "border-warning/20 bg-warning/5"
                    : "border-info/20 bg-info/5"
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {wp.skill}
                </span>
                <Badge variant={config.variant}>{config.label}</Badge>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-muted">
                  <span className="font-medium">JD requires:</span>{" "}
                  {wp.jd_requirement}
                </p>
                <p className="text-xs text-muted">
                  <span className="font-medium">Resume:</span>{" "}
                  {wp.resume_evidence}
                </p>
                <p className="text-xs text-foreground">
                  <span className="font-medium">Tip:</span> {wp.suggestion}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
