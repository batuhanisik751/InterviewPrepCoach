export default function NewSessionLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-48 rounded bg-surface-tertiary" />
        <div className="mt-2 h-4 w-72 rounded bg-surface-tertiary" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-surface-tertiary" />
          <div className="h-64 rounded-lg border border-border bg-surface" />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 rounded-lg border border-border bg-surface" />
            <div className="h-16 rounded-lg border border-border bg-surface" />
          </div>
          <div className="h-48 rounded-lg border border-border bg-surface" />
        </div>
      </div>
    </div>
  );
}
