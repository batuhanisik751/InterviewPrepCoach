export default function MockLoading() {
  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-3xl flex-col animate-pulse">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
        <div>
          <div className="h-6 w-32 rounded bg-surface-tertiary" />
          <div className="mt-1 h-4 w-48 rounded bg-surface-tertiary" />
        </div>
        <div className="h-8 w-28 rounded-lg bg-surface-tertiary" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="h-40 w-80 rounded-xl border border-border bg-surface" />
      </div>
    </div>
  );
}
