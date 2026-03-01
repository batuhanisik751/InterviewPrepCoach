import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <main className="flex max-w-2xl flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-2xl font-bold text-white">
            IP
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Interview Prep Coach
          </h1>
        </div>

        <p className="max-w-lg text-lg text-muted">
          Paste your resume and a job description. Get tailored interview
          questions, AI-powered answer evaluation, and mock behavioral
          interviews — all scored for clarity, structure, and depth.
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-brand-600 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-700"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-surface-secondary"
          >
            Log In
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-6 text-left">
            <div className="mb-3 text-2xl">?</div>
            <h3 className="mb-1 font-semibold text-foreground">
              Tailored Questions
            </h3>
            <p className="text-sm text-muted">
              AI generates interview questions matched to your resume and the
              specific role.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 text-left">
            <div className="mb-3 text-2xl">*</div>
            <h3 className="mb-1 font-semibold text-foreground">
              Smart Scoring
            </h3>
            <p className="text-sm text-muted">
              Get scored on clarity, structure, and depth with detailed feedback
              and STAR format analysis.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 text-left">
            <div className="mb-3 text-2xl">&gt;</div>
            <h3 className="mb-1 font-semibold text-foreground">
              Mock Interviews
            </h3>
            <p className="text-sm text-muted">
              Practice with a realistic AI interviewer that asks follow-ups and
              gives real-time coaching.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
