---
id: T017
title: Test mode, health check and Coming Soon retirement
milestone: M0
release: 1
depends_on: [T003]
migrations: false
requires_human: true
spec: ['SPEC §11.1', 'SPEC §11.2', 'SPEC §3.5']
skills: [payload]
---

# T017: Test mode, health check and Coming Soon retirement

## Context

There is no staging (SPEC §11.1): every merge to `main` deploys to production. Production is public from the start and serves the site as built so far (SPEC §11.1), so every integration must run in test mode until launch. This ticket lands early so later tickets can merge safely.

Human steps: in the Vercel project, confirm the production branch is `main`, and leave `SITE_LIVE` unset for Production. In the Supabase project, turn on automatic RLS for new tables. Never put these values in the repo.

## Scope

**In**

- `src/env.ts`: optional `SITE_LIVE`; helper `isLive()` in `src/utils/site.ts`. Later tickets use `isLive()` wherever they need test mode (SPEC §11.1) and never read `NODE_ENV` or `VERCEL_ENV` for it.
- Retire Coming Soon (SPEC §11.4): hide the `coming-soon` global in the admin (`admin.hidden: true`) and delete its unused frontend code (`src/components/Hero.tsx`, `src/components/Header.tsx`, `src/utils/crossfadeKeyframes.ts`, the Coming Soon rules in `styles.css`, and `qrcode` if nothing else uses them). Keep the global in the config so no migration drops its tables and the T011 content migration still reads its images on a fresh database.
- `/api/health`: 200 when the database answers, 503 otherwise.
- `docs/DEPLOY.md`: deploy (merge to `main`), roll back (Vercel Instant Rollback, only to a deployment whose code works with the current schema), migrations, rotating secrets, launch (set `SITE_LIVE`, swap to live keys and the production Airtable base), and moving the Vercel and Supabase projects to Amagi (used by T018).

**Out**

- Launch and the ownership move (T018).

## Acceptance criteria

- [ ] **AC1**: Coming Soon is retired without a schema change.
  - _Verify (browser):_ the admin sidebar has no Coming Soon entry; Home still renders its logo and hero images.
  - _Verify (cli):_ `pnpm payload migrate:create --skip-empty check` creates nothing; `grep -rn "coming-soon-" src/components src/app` returns nothing.
- [ ] **AC2**: Health check reports the database.
  - _Verify (api):_ `curl -i /api/health` returns 200; with the database stopped, it returns 503.
- [ ] **AC3**: Test mode is the default.
  - _Verify (unit):_ `tests/int/site.int.spec.ts` covers `isLive()` for unset, `true` and other values.
- [ ] **AC4**: Production is healthy after merge.
  - _Verify (deploy, after merge):_ `curl -i https://<production>/` returns Home and `curl -i https://<production>/api/health` returns 200.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
