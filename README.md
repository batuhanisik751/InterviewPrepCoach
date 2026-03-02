# Interview Prep Coach

AI-powered interview preparation coach built with Next.js, Mistral 7B (via Ollama), and Supabase.

## Features

- **Tailored Question Generation** — Paste a resume (or upload a PDF) + job description to get 5 AI-generated interview questions (behavioral, technical, situational)
- **Answer Evaluation** — AI scores answers on clarity (25%), structure (30%), and depth (45%) with detailed feedback and suggested stronger answers
- **STAR Format Analysis** — Behavioral answers are checked for Situation, Task, Action, and Result components with per-component scoring
- **Weak Point Detection** — Identifies 3-8 gaps between your resume and the job description with severity levels and coaching suggestions
- **Mock Interviews** — Real-time streaming conversational mock interviews with AI follow-up questions
- **Dashboard & Progress Tracking** — Score trends, session history, and comprehensive results breakdowns
- **Authentication** — Email/password auth with protected routes and row-level security
- **PDF Resume Parsing** — Upload a PDF resume and have it automatically extracted (up to 5 MB, 15k character limit)
- **Theme Switching** — Light, dark, and system-preference theme modes
- **Rate Limiting** — 20 AI calls per hour per user to prevent abuse

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **AI**: Mistral 7B running locally via [Ollama](https://ollama.com) + Vercel AI SDK v6 (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives + CVA variants)
- **Icons**: [Lucide React](https://lucide.dev)
- **Styling**: Tailwind CSS v4 with semantic CSS custom property tokens
- **Dark Mode**: [next-themes](https://github.com/pacocoursey/next-themes) (class-based with system preference)
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **PDF Parsing**: pdf-parse
- **Validation**: Zod
- **Charts**: Recharts
- **Testing**: Vitest + Testing Library

## Getting Started

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install and start [Ollama](https://ollama.com), then pull the model:
   ```bash
   ollama pull mistral
   ollama serve
   ```
4. Copy `.env.example` to `.env.local` and fill in your Supabase keys:
   ```bash
   cp .env.example .env.local
   ```
5. Set up Supabase:
   - Create a project at [supabase.com](https://supabase.com)
   - Go to **Settings > API** to get your URL and keys
   - Go to **SQL Editor** and run each file in `supabase/migrations/` in order (001-006)
   - (Optional) Disable email confirmation under **Authentication > Providers > Email** for easier local testing
6. Start the dev server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run test       # Run tests
npm run test:watch # Run tests in watch mode
```

## Environment Variables

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API > Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Settings > API > Secret key |

No AI API key needed — Mistral 7B runs locally via Ollama.

## Project Structure

```
src/
├── app/
│   ├── (auth)/       # Login, signup, OAuth callback
│   ├── (app)/        # Protected routes (dashboard, sessions, history, settings)
│   │   ├── dashboard/    # Stats, score trends, recent sessions
│   │   ├── history/      # Sessions table with search, sorting, grid/table views
│   │   ├── session/
│   │   │   ├── new/      # 3-step wizard: Resume → Job Description → Generate
│   │   │   └── [id]/     # Questions, answers, mock interview, results
│   │   └── settings/     # Profile, appearance (theme), notifications
│   └── api/          # AI API routes (questions, evaluation, weak points, mock chat, resume parsing)
├── components/
│   ├── ui/           # shadcn/ui components (Button, Card, Input, Tabs, Table, Sheet, etc.)
│   ├── layout/       # AppShell (sidebar + navbar)
│   └── features/     # ScoreBar, StarBreakdown, WeakPointsList, MockChatBubble, ProgressChart
├── lib/
│   ├── supabase/     # Client + server Supabase utilities
│   ├── ai/           # Ollama client, prompts, Zod schemas
│   ├── rate-limit.ts # In-memory rate limiter
│   └── utils.ts      # cn() utility (clsx + tailwind-merge)
└── types/            # TypeScript type definitions
```
