export default function HistoryLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-8 w-32 rounded bg-accent animate-pulse" />
          <div className="mt-2 h-4 w-56 rounded bg-accent animate-pulse" />
        </div>
        <div className="h-10 w-28 rounded-lg bg-accent animate-pulse" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border bg-accent/50 px-4 py-3">
          <div className="flex gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-16 rounded bg-accent animate-pulse" />
            ))}
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-b border-border px-4 py-4 last:border-0">
            <div className="flex items-center justify-between">
              <div className="h-4 w-40 rounded bg-accent animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-accent animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
