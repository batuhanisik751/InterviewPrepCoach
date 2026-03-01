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
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="mb-3 text-sm font-medium text-foreground">
        STAR Format Analysis
      </p>

      <div className="space-y-3">
        {labels.map(({ key, label, letter }) => {
          const comp = components[key];
          return (
            <div key={key} className="flex gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  comp.present
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                )}
              >
                {letter}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      comp.present ? "text-success" : "text-danger"
                    )}
                  >
                    {comp.present ? `${comp.score}/10` : "Missing"}
                  </span>
                </div>
                {comp.present && comp.text && (
                  <p className="mt-1 text-xs text-muted line-clamp-2">
                    {comp.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {missing_components.length > 0 && (
        <div className="mt-4 rounded-lg bg-warning/5 p-3">
          <p className="text-xs font-medium text-warning">
            Missing: {missing_components.join(", ")}
          </p>
        </div>
      )}

      {improvement_tips.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-muted">Tips:</p>
          <ul className="space-y-1">
            {improvement_tips.map((tip, i) => (
              <li key={i} className="text-xs text-muted">
                - {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
