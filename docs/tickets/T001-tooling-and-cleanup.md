---
id: T001
title: Repo clean-up, scripts, env validation and preflight
milestone: M0
release: 1
depends_on: []
migrations: false
requires_human: true
spec: ['SPEC §11.1', 'SPEC §11.2', 'SPEC §11.5']
skills: [payload]
---

# T001: Repo clean-up, scripts, env validation and preflight

## Context

The repo started from the Payload plugin template and still carries its scaffolding. Remove it, move local development onto the Supabase CLI with a one-way pull from staging, add the scripts the build protocol needs, and add `pnpm preflight` so `/orchestrate` can run. **Do this ticket in a normal session, not through `/orchestrate`.**

Human steps, in the main checkout:

1. Install Docker and have it running. Log in to GitHub with `gh auth login` if `gh auth status` fails (preflight checks it).
2. Before the pull is built, add the staging connection details to `.env`: `PULL_DATABASE_URL` is the current Supabase project's connection string (today's `DATABASE_URL` works); `PULL_S3_*` take today's `S3_*` values.
3. Once `pnpm supabase start` runs, switch the app to the local stack: set `DATABASE_URL` and `S3_*` to the `.env.example` values, with the local Storage keys from `pnpm supabase status`. `pnpm db:pull` refuses to run until `DATABASE_URL` is local, and until then `pnpm dev` still uses staging.

## Scope

**In**

- Delete the remaining plugin-template leftovers: `dev/` and the `"dev"` entry in `tsconfig.json`'s `exclude`. (`src/index.ts`, `src/exports/`, `src/endpoints/`, `BeforeDashboard*` and `src/app/my-route/` went in PR #3.)
- Remove duplicate configs: keep `eslint.config.mjs`, `playwright.config.ts`, `vitest.config.mts`; delete the `.js` versions.
- Delete `package-lock.json`, `.yarnrc`, `Dockerfile` and `docker-compose.yml`: pnpm only, Vercel builds the app, and the Supabase CLI replaces the compose file.
- Move `pnpm.onlyBuiltDependencies` from `package.json` into `allowBuilds` in `pnpm-workspace.yaml`, so pnpm 11 stops ignoring it.
- Remove unused dependencies left by the template (check with `pnpm why`). Keep `qrcode` and `lucide-react` (used by Coming Soon).
- `package.json` scripts: `typecheck` (`tsc --noEmit`), `test:int`, `test:e2e`, `preflight` (`tsx scripts/preflight.ts`). Keep existing Payload scripts.
- `s3Storage` in `src/payload.config.ts`: `clientUploads: true` (SPEC §11.2).
- Supabase CLI as a dev dependency (`supabase` package), with `supabase: true` in `allowBuilds` so its binary installs; every command runs as `pnpm supabase …`. `pnpm supabase init`, committing `supabase/config.toml` only. The local main database is `amagi_cbhs`.
- `scripts/db-pull.ts` (`pnpm db:pull`) per SPEC §11.5: reads `PULL_DATABASE_URL` and `PULL_S3_*`; refuses to run unless `DATABASE_URL` points at `127.0.0.1`; drops and recreates local `amagi_cbhs`; pipes `pg_dump --schema=public --no-owner --no-acl --exclude-table-data='form_submissions*'` into it; copies every object in the staging bucket to the local bucket; prints table row counts and the object count. Never writes to a remote. The `pnpm payload migrate` step is added in T003.
- `src/env.ts`: Zod schema validating required env vars at startup (only those already used: `DATABASE_URL`, `PAYLOAD_SECRET`, `S3_*`). Later tickets extend it.
- `.env.example` updated to match: local Supabase values for the app, placeholders for `PULL_*`.
- `scripts/preflight.ts`: prints `PREFLIGHT OK` or `PREFLIGHT FAIL: <reason>` and exits non-zero on failure. Checks, in order: the local Supabase stack is up (`pnpm supabase status`, else `pnpm supabase start`); on `main` with a clean tree level with `origin/main`; `gh auth status`; `pnpm install --frozen-lockfile`; `pnpm payload migrate` succeeds on the local main database (`amagi_cbhs`); `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build`. Logs to `.verification/preflight.log`.
- `PROMPT.md` kept as written by the agentic setup.
- Replace `README.md` with local setup steps: install Docker, `pnpm install`, `pnpm supabase start`, `.env`, `pnpm db:pull`, `pnpm dev`.

**Out**

- Migrations baseline (T003). CI (T002).

## Acceptance criteria

- [ ] **AC1**: No template or Docker leftovers remain.
  - _Verify (code):_ `ls dev package-lock.json .yarnrc Dockerfile docker-compose.yml 2>&1` reports each as missing; `grep -rn "amagiCbhs\|plugin-collection\|BeforeDashboard" src` returns nothing.
- [ ] **AC2**: Only one config of each kind remains.
  - _Verify (code):_ `ls eslint.config.* playwright.config.* vitest.config.*` lists exactly `eslint.config.mjs`, `playwright.config.ts`, `vitest.config.mts`.
- [ ] **AC3**: `db:pull` copies staging locally, one way.
  - _Verify (db):_ after `pnpm db:pull`, row counts for `users`, `media` and `coming_soon` match the same `select count(*)` run read-only against `$PULL_DATABASE_URL`; `curl -I` on a pulled media file's local Storage URL returns 200. With `DATABASE_URL` set to a non-local host, `pnpm db:pull` exits non-zero before writing anything.
- [ ] **AC4**: Missing env vars fail fast with a readable message.
  - _Verify (cli):_ `PAYLOAD_SECRET= pnpm build` fails and names `PAYLOAD_SECRET`; with it set, the build passes.
- [ ] **AC5**: Preflight passes on a clean `main` and fails on a dirty tree.
  - _Verify (cli):_ on clean `main`, `pnpm preflight` prints `PREFLIGHT OK`, exit 0. After `touch scratch.txt`, it prints `PREFLIGHT FAIL` naming the dirty tree, exit non-zero. Remove `scratch.txt`.
- [ ] **AC6**: The Coming Soon page still renders.
  - _Verify (browser):_ `/` shows the Coming Soon headline at 390px and 1280px with no console errors.
- [ ] **AC7**: Admin uploads go straight to storage.
  - _Verify (code):_ `grep -n "clientUploads: true" src/payload.config.ts` matches.
- [ ] **AC8**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
