export default function SessionLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-56 rounded bg-accent" />
        <div className="mt-2 h-4 w-32 rounded bg-accent" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-accent" />
              <div className="h-5 w-20 rounded-full bg-accent" />
              <div className="h-5 w-16 rounded-full bg-accent" />
            </div>
            <div className="h-4 w-full rounded bg-accent" />
            <div className="mt-2 h-4 w-3/4 rounded bg-accent" />
          </div>
        ))}
      </div>
    </div>
  );
}
