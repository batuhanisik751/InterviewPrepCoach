import { Progress } from "@/components/ui/Progress";

interface ScoreDisplayProps {
  clarity: number;
  structure: number;
  depth: number;
  overall: number;
}

export function ScoreDisplay({ clarity, structure, depth, overall }: ScoreDisplayProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Score Breakdown</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">
            {overall.toFixed(1)}
          </span>
          <span className="text-sm text-muted">/ 10</span>
        </div>
      </div>
      <div className="space-y-3">
        <Progress value={clarity} label="Clarity (25%)" />
        <Progress value={structure} label="Structure (30%)" />
        <Progress value={depth} label="Depth (45%)" />
      </div>
    </div>
  );
}
