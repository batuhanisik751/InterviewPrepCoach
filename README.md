# Interview Prep Coach

AI-powered interview preparation coach built with Next.js, Claude API, and Supabase.

## Features

- Paste resume + job description to get tailored interview questions
- AI evaluates answers on clarity, structure, and depth
- STAR format enforcement for behavioral questions
- Weak point detection (resume vs JD gap analysis)
- Mock behavioral interviews with streaming AI responses

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **AI**: Claude API via Vercel AI SDK
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth)
- **Validation**: Zod

## Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your keys
3. Run `npm install`
4. Run `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)
