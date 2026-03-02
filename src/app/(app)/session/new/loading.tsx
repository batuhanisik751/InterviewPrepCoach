export default function NewSessionLoading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-8">
      <div>
        <div className="h-8 w-48 rounded bg-accent" />
        <div className="mt-2 h-4 w-72 rounded bg-accent" />
      </div>

      <div className="flex justify-center gap-4">
        <div className="h-10 w-32 rounded-full bg-accent" />
        <div className="h-10 w-32 rounded-full bg-accent" />
        <div className="h-10 w-32 rounded-full bg-accent" />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="h-4 w-16 rounded bg-accent" />
        <div className="mt-4 h-64 rounded-lg bg-accent" />
      </div>
    </div>
  );
}
