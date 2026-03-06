# Interview Prep Coach

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run test` — Vitest (single run)
- `npm run test:watch` — Vitest watch mode

## Tech Stack
Next.js 16 (App Router) | TypeScript | Tailwind CSS 4 | shadcn/ui | Supabase (Postgres + RLS) | Ollama (Mistral 7B) | Vercel AI SDK v6 | Zod

## Architecture
- `src/app/api/` — 9 REST endpoints (questions, answers, mock interview, resume, sessions, weakpoints)
- `src/components/features/` — domain components | `src/components/ui/` — shadcn/ui
- `src/lib/ai/` — Ollama prompts, schemas, scoring (Clarity 25% + Structure 30% + Depth 45%)
- `src/lib/guardrails/` — prompt injection, content moderation, PII redaction, output consistency
- `src/lib/supabase/` — browser + server clients
- `src/types/` — shared TypeScript interfaces

## Code Style
- ES modules (import/export), not CommonJS
- `"use client"` directive only on interactive components
- Zod for all API input validation
- Follow existing shadcn/ui patterns for new components

## Important
- NEVER commit .env files — use .env.example for reference
- Rate limiter: 20 AI calls/hour/user (in-memory, see lib/rate-limit.ts)
- All user text goes through guardrails before AI processing
- Supabase RLS enforces per-user data isolation — never bypass with service role unless required

## Workflow
- IMPORTANT: After completing ANY code changes, ALWAYS use the `post-change` subagent before finishing. It writes/runs tests, updates README/gitignore if needed, and suggests a commit message. Do NOT skip this step.

## Context Management
- Use subagents for codebase research — keeps main context clean
- When compacting, ALWAYS preserve: list of modified files, test commands run, any failing test details, and current task progress
- Prefer reading specific files over broad exploration
- Run single tests, not the full suite, for faster feedback
