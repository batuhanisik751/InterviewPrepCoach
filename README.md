# Interview Prep Coach

AI-powered interview preparation coach built with Next.js, Claude API, and Supabase.

## Features

- Paste resume + job description to get tailored interview questions
- AI evaluates answers on clarity, structure, and depth
- STAR format enforcement for behavioral questions
- Weak point detection (resume vs JD gap analysis)
- Mock behavioral interviews with streaming AI responses
- Email/password authentication with protected routes

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **AI**: Claude API via Vercel AI SDK
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Validation**: Zod

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
│   └── api/          # API routes for AI features
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Sidebar, navbar
│   └── features/     # Feature-specific components
├── lib/
│   ├── supabase/     # Supabase client utilities
│   └── ai/           # Claude API client and prompts
├── hooks/            # Custom React hooks
└── types/            # TypeScript type definitions
```
