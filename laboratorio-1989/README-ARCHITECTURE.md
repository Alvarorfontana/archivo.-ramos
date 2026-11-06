# ARCHIVO 1989 Workbench

Next.js application for a private historical research workspace.

- Database: Neon PostgreSQL. SQL schema: `db/schema.sql`.
- AI provider: Google Gemini, server-side REST integration in `lib/gemini.ts`.
- API: document records, saved reports, AI analysis, NARA catalog search, FRUS catalog feed, health status.
- Dashboard uses live database counts. No invented historical records are seeded.

## Required Vercel environment variables

- `DATABASE_URL`: Neon pooled connection string.
- `GEMINI_API_KEY`: Google AI Studio key.
- `GEMINI_MODEL`: optional model override; default `gemini-2.5-flash`.
- `ARCHIVE_ACCESS_PASSWORD`: shared password for the initial private workspace gate.
- `NARA_API_KEY`: optional NARA Catalog API key.

Keep all secrets server-side. Never use `NEXT_PUBLIC_` for secret values.

## Setup

1. Provision a Neon resource and associate it with this Vercel project.
2. Add the required secrets to Vercel environments.
3. Run `npm install` and `npm run db:migrate`.
4. Run `npm run build` and deploy with Root Directory `laboratorio-1989`.

The current access gate is a shared password, not individual user accounts or role-based access. Add proper user authentication before inviting a wider team. Gemini analysis is restricted to selected database documents and must be reviewed by a human. External catalog results are not imported automatically.
