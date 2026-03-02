export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-64 rounded bg-accent animate-pulse" />
        <div className="mt-2 h-4 w-48 rounded bg-accent animate-pulse" />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="mx-auto h-8 w-12 rounded bg-accent animate-pulse" />
            <div className="mx-auto mt-2 h-4 w-24 rounded bg-accent animate-pulse" />
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 h-5 w-28 rounded bg-accent animate-pulse" />
        <div className="h-48 rounded bg-accent animate-pulse" />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 h-5 w-36 rounded bg-accent animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-lg border border-border bg-accent animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
