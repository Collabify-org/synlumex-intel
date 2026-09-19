# SYNLUMEX INTEL

Owner-side EPC project operating system.

## Stack
- Next.js 14 (App Router) — deployed on Vercel
- Supabase (Postgres + Auth + Storage + Edge Functions)
- Gemini API (BOQ extraction + risk intelligence)

## Architecture
- Zero local development — all edits via GitHub web editor
- Vercel auto-deploys from `main`
- Supabase Edge Functions auto-deploy from `supabase/functions/`
- Manual user creation only (no public signup)

## Deployment
Push to `main` → Vercel + Supabase auto-deploy.
