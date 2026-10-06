---
id: T017
title: Lock production until launch, test mode and health check
milestone: M0
release: 1
depends_on: [T003]
migrations: false
requires_human: true
spec: ['SPEC §11.1', 'SPEC §11.2', 'SPEC §3.5']
skills: [payload]
---

# T017: Lock production until launch, test mode and health check

## Context

There is no staging (SPEC §11.1): every merge to `main` deploys to production. Until launch, production must show only Coming Soon to the public, and every integration must run in test mode. This ticket lands early so later tickets can merge safely.

Human steps: in the Vercel project, confirm the production branch is `main`, and set `SITE_LOCKED=true` for Production (leave `SITE_LIVE` unset). In the Supabase project, turn on automatic RLS for new tables. Never put these values in the repo.

## Scope

**In**

- `src/env.ts`: optional `SITE_LIVE` and `SITE_LOCKED`; helpers `isLive()` and `isLocked()` in `src/utils/site.ts`. Later tickets use `isLive()` wherever they need test mode (SPEC §11.1) and never read `NODE_ENV` or `VERCEL_ENV` for it.
- Site lock per SPEC §11.1 in `src/proxy.ts`: when `isLocked()`, anonymous requests to frontend routes are rewritten to the Coming Soon page; every response carries `X-Robots-Tag: noindex`. Authenticated CMS users pass through. Verify the session (for example `payload.auth({ headers })`), not just the presence of the cookie. `/admin`, `/api/*` and `/_next/*` are not locked.
- Move the Coming Soon page from `/` to its own route for the lock to rewrite to. `/` keeps showing it until T011 replaces `/` with Home.
- `robots.txt` disallows everything while locked.
- `/api/health`: 200 when the database answers, 503 otherwise.
- `docs/DEPLOY.md`: deploy (merge to `main`), roll back (Vercel Instant Rollback, only to a deployment whose code works with the current schema), migrations, rotating secrets, launch (set `SITE_LIVE`, unset `SITE_LOCKED`, swap to live keys and the production Airtable base), and moving the Vercel and Supabase projects to Amagi (used by T018).

**Out**

- Launch and the ownership move (T018).

## Acceptance criteria

- [ ] **AC1**: Anonymous visitors see only Coming Soon while locked.
  - _Verify (api):_ with `SITE_LOCKED=true`, anonymous `curl -i /does-not-exist` returns 200 with the Coming Soon headline and `X-Robots-Tag: noindex`; logged in (cookie from `POST /api/users/login`), the same URL returns 404. `/admin/login` and `/api/health` respond normally without a session. With `SITE_LOCKED` unset, the anonymous request returns 404.
- [ ] **AC2**: A forged cookie doesn't unlock the site.
  - _Verify (api):_ with `SITE_LOCKED=true`, `curl -i -b "payload-token=forged" /does-not-exist` returns the Coming Soon page.
- [ ] **AC3**: Test mode is the default.
  - _Verify (unit):_ `tests/int/site.int.spec.ts` covers `isLive()` and `isLocked()` for unset, `true` and other values.
- [ ] **AC4**: Production is locked after merge.
  - _Verify (deploy, after merge):_ `curl -i https://<production>/does-not-exist` returns the Coming Soon page with `X-Robots-Tag: noindex`; `curl -i https://<production>/api/health` returns 200.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
