# Interview Prep Coach

AI-powered interview preparation coach built with Next.js, Claude API, and Supabase.

## Features

- **Tailored Question Generation** — Paste a resume + job description to get 10 AI-generated interview questions (behavioral, technical, situational)
- **Answer Evaluation** — AI scores answers on clarity (25%), structure (30%), and depth (45%) with detailed feedback and suggested stronger answers
- **STAR Format Analysis** — Behavioral answers are checked for Situation, Task, Action, and Result components with per-component scoring
- **Weak Point Detection** — Identifies 3-8 gaps between your resume and the job description with severity levels and coaching suggestions
- **Mock Interviews** — Real-time streaming conversational mock interviews with AI follow-up questions (6-8 exchanges)
- **Dashboard & Progress Tracking** — Score trends, session history, and comprehensive results breakdowns
- **Authentication** — Email/password auth with protected routes and row-level security
- **Rate Limiting** — 20 AI calls per hour per user to prevent abuse

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **AI**: Claude API via Vercel AI SDK v6 (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Validation**: Zod
- **Charts**: Recharts
- **Testing**: Vitest + Testing Library

## Getting Started

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
4. Set up Supabase:
   - Create a project at [supabase.com](https://supabase.com)
   - Go to **Settings > API** to get your URL and keys
   - Go to **SQL Editor** and run each file in `supabase/migrations/` in order (001-006)
   - (Optional) Disable email confirmation under **Authentication > Providers > Email** for easier local testing
5. Start the dev server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

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
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) > API Keys |

## Project Structure

```
src/
├── app/
│   ├── (auth)/       # Login, signup, OAuth callback
│   ├── (app)/        # Protected routes (dashboard, sessions, history)
│   │   ├── dashboard/    # Stats, score trends, recent sessions
│   │   ├── history/      # All sessions table
│   │   ├── session/
│   │   │   ├── new/      # Resume + JD input
│   │   │   └── [id]/     # Questions, answers, mock interview, results
│   │   └── settings/
│   └── api/          # AI API routes (questions, evaluation, weak points, mock chat)
├── components/
│   ├── ui/           # Button, Card, Input, Textarea, Badge, Spinner, Progress
│   ├── layout/       # Sidebar, Navbar
│   └── features/     # ScoreDisplay, StarBreakdown, WeakPointsList, MockChatBubble, ProgressChart
├── lib/
│   ├── supabase/     # Client + server Supabase utilities
│   ├── ai/           # Claude API client, prompts, Zod schemas
│   ├── rate-limit.ts # In-memory rate limiter
│   └── utils.ts      # cn() utility
├── hooks/            # Custom React hooks
└── types/            # TypeScript type definitions
```
