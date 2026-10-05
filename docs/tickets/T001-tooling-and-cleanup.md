---
id: T001
title: Repo clean-up, scripts, env validation and preflight
milestone: M0
release: 1
depends_on: []
migrations: false
requires_human: false
spec: ['SPEC §11.2']
skills: [payload]
---

# T001: Repo clean-up, scripts, env validation and preflight

## Context

The repo started from the Payload plugin template and still carries its scaffolding. Remove it, add the scripts the build protocol needs, and add `pnpm preflight` so `/orchestrate` can run. **Do this ticket in a normal session, not through `/orchestrate`.**

## Scope

**In**

- Delete plugin-template code: `src/index.ts`, `src/exports/`, `src/endpoints/`, `src/components/BeforeDashboard*`, `src/app/my-route/`, `dev/`.
- Remove duplicate configs: keep `eslint.config.mjs`, `playwright.config.ts`, `vitest.config.mts`; delete the `.js` versions.
- Remove unused dependencies left by the template (check with `pnpm why`). Keep `qrcode` and `lucide-react` (used by Coming Soon).
- `package.json` scripts: `typecheck` (`tsc --noEmit`), `test:int`, `test:e2e`, `preflight` (`tsx scripts/preflight.ts`). Keep existing Payload scripts.
- `next.config.ts`: add `output: 'standalone'`.
- `src/env.ts`: Zod schema validating required env vars at startup (only those already used: `DATABASE_URL`, `PAYLOAD_SECRET`, `S3_*`). Later tickets extend it.
- `.env.example` updated to match.
- `scripts/preflight.ts`: prints `PREFLIGHT OK` or `PREFLIGHT FAIL: <reason>` and exits non-zero on failure. Checks, in order: Docker Postgres is up (`docker compose up -d --wait postgres`); on `main` with a clean tree level with `origin/main`; `gh auth status`; `pnpm install --frozen-lockfile`; `pnpm payload migrate` succeeds on the main database; `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build`. Logs to `.verification/preflight.log`.
- `PROMPT.md` kept as written by the agentic setup.
- Replace `README.md` with local setup steps for this project.

**Out**

- Migrations baseline (T003). CI (T002).

## Acceptance criteria

- [ ] **AC1**: No plugin-template code remains.
  - _Verify (code):_ `ls src/index.ts src/exports src/endpoints dev src/app/my-route 2>&1` reports each as missing; `grep -rn "amagiCbhs\|plugin-collection\|BeforeDashboard" src` returns nothing.
- [ ] **AC2**: Only one config of each kind remains.
  - _Verify (code):_ `ls eslint.config.* playwright.config.* vitest.config.*` lists exactly `eslint.config.mjs`, `playwright.config.ts`, `vitest.config.mts`.
- [ ] **AC3**: Standalone output builds.
  - _Verify (cli):_ `pnpm build && ls .next/standalone/server.js` exits 0.
- [ ] **AC4**: Missing env vars fail fast with a readable message.
  - _Verify (cli):_ `PAYLOAD_SECRET= pnpm build` fails and names `PAYLOAD_SECRET`; with it set, the build passes.
- [ ] **AC5**: Preflight passes on a clean `main` and fails on a dirty tree.
  - _Verify (cli):_ on clean `main`, `pnpm preflight` prints `PREFLIGHT OK`, exit 0. After `touch scratch.txt`, it prints `PREFLIGHT FAIL` naming the dirty tree, exit non-zero. Remove `scratch.txt`.
- [ ] **AC6**: The Coming Soon page still renders.
  - _Verify (browser):_ `/` shows the Coming Soon headline at 390px and 1280px with no console errors.
- [ ] **AC7**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
