export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">History</h1>
        <p className="mt-1 text-muted">
          Your past interview prep sessions.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-12 text-center">
        <p className="text-muted">
          No sessions yet. Start a new session to begin!
        </p>
      </div>
    </div>
  );
}
