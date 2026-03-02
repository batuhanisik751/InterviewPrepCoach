import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarComponent {
  present: boolean;
  text: string;
  score: number;
}

interface StarBreakdownProps {
  situation: StarComponent;
  task: StarComponent;
  action: StarComponent;
  result: StarComponent;
  missing_components: string[];
  improvement_tips: string[];
}

const labels = [
  { key: "situation" as const, label: "Situation", letter: "S" },
  { key: "task" as const, label: "Task", letter: "T" },
  { key: "action" as const, label: "Action", letter: "A" },
  { key: "result" as const, label: "Result", letter: "R" },
];

export function StarBreakdown({
  situation,
  task,
  action,
  result,
  missing_components,
  improvement_tips,
}: StarBreakdownProps) {
  const components = { situation, task, action, result };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="mb-3 text-xs font-semibold text-muted-foreground">
        STAR Breakdown
      </p>

      <div className="grid gap-2">
        {labels.map(({ key, label }) => {
          const comp = components[key];
          return (
            <div key={key} className="flex items-start gap-2 text-sm">
              <span className={cn("mt-0.5", comp.present ? "text-[#10b981]" : "text-[#ef4444]")}>
                {comp.present ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
              </span>
              <div className="min-w-0">
                <span className="font-medium capitalize text-foreground">{label}</span>
                <span className="ml-2 text-muted-foreground">
                  {comp.present ? `(${comp.score}/10)` : "(Missing)"}
                </span>
                {comp.present && comp.text && (
                  <p className="mt-0.5 text-xs italic text-muted-foreground line-clamp-2">
                    &ldquo;{comp.text}&rdquo;
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {missing_components.length > 0 && (
        <div className="mt-3 rounded-lg bg-[#f59e0b]/5 p-3">
          <p className="text-xs font-medium text-[#f59e0b]">
            Missing: {missing_components.join(", ")}
          </p>
        </div>
      )}

      {improvement_tips.length > 0 && (
        <div className="mt-3 rounded-lg bg-muted/50 p-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Tips:</p>
          <ul className="space-y-1">
            {improvement_tips.map((tip, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                &bull; {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
