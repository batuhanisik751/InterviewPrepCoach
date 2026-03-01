export default function ResultsLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-8 w-48 rounded bg-surface-tertiary" />
          <div className="mt-2 h-5 w-32 rounded-full bg-surface-tertiary" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-surface-tertiary" />
      </div>

      <div className="mb-6 rounded-xl border border-border bg-surface p-6">
        <div className="mb-4 h-5 w-40 rounded bg-surface-tertiary" />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="text-center">
            <div className="mx-auto h-12 w-16 rounded bg-surface-tertiary" />
            <div className="mx-auto mt-2 h-4 w-24 rounded bg-surface-tertiary" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 rounded bg-surface-tertiary" />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="mb-4 h-5 w-40 rounded bg-surface-tertiary" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
