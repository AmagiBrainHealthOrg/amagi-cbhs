---
id: T017
title: Staging on Vercel
milestone: M3
release: 1
depends_on: [T010, T011, T014, T015]
migrations: true
requires_human: true
spec: ['SPEC §11.1', 'SPEC §11.2', 'SPEC §3.5']
skills: [payload]
---

# T017: Staging on Vercel

## Context

The Vercel project already builds `main` on Tandem's Hobby team (SPEC §11.2). This ticket makes that deployment a proper staging environment. Production comes in T018.

Human steps: set the staging environment variables in Vercel (transaction-pooler `DATABASE_URL`, `PAYLOAD_SECRET`, `S3_*`, Stripe test keys, Resend, staging spreadsheet, basic-auth credentials, `SITE_ENV=staging`); turn on automatic RLS in the staging Supabase project; add a DNS-only Cloudflare record for the staging hostname. Never put these values in the repo.

## Scope

**In**

- `vercel-build` script: `pnpm payload migrate` when `VERCEL_ENV=production`, then `next build`. Previews never migrate.
- `/api/health`: 200 when the database answers, 503 otherwise. Exempt from basic auth.
- Staging protection in `src/proxy.ts` when `SITE_ENV=staging`: basic auth and `X-Robots-Tag: noindex`. Preview deployments use Vercel's deployment protection.
- Migration enabling RLS on every table in `public` (idempotent; loops over `pg_tables`), so new environments get it without manual SQL.
- Staging behaviour: Stripe test mode, `isTest` submissions, staging spreadsheet, email sandbox.
- `docs/DEPLOY.md`: deploy (merge to `main`), roll back (Vercel Instant Rollback, only to a deployment whose code works with the current schema), migrations, rotating secrets, moving the project to Amagi's Pro team (used by T018).

**Out**

- Production and the Pro team move (T018).

## Acceptance criteria

- [ ] **AC1**: Staging serves the app behind basic auth.
  - _Verify (deploy):_ `curl -i https://<staging>/about` returns 401; with credentials returns 200 and `X-Robots-Tag: noindex`.
- [ ] **AC2**: Staging is isolated.
  - _Verify (deploy):_ a staging form submission lands in the staging spreadsheet with `isTest` true; a staging donation uses Stripe test mode.
- [ ] **AC3**: Migrations run on `main` deployments only.
  - _Verify (deploy):_ the build log of a `main` deployment shows `payload migrate` completing before `next build`; a preview deployment's log doesn't run it.
- [ ] **AC4**: The Data API exposes nothing.
  - _Verify (db + deploy):_ on staging, `select count(*) from pg_tables where schemaname = 'public' and not rowsecurity` returns 0, and `curl -s "https://<ref>.supabase.co/rest/v1/users?select=*" -H "apikey: <anon key>"` returns no rows.
- [ ] **AC5**: Health check works.
  - _Verify (deploy):_ `curl -i https://<staging>/api/health` returns 200 without credentials.
- [ ] **AC6**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
