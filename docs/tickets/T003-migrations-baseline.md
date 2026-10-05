---
id: T003
title: Switch to migrations and create the baseline
milestone: M0
depends_on: [T001]
migrations: true
requires_human: false
spec: ['SPEC §11.2']
skills: [payload]
---

# T003: Switch to migrations and create the baseline

## Context

The Postgres adapter currently pushes schema in development. Every later ticket ships migrations, so we need a baseline that matches the current schema.

## Scope

**In**

- `postgresAdapter({ push: false, migrationDir: path.resolve(dirname, 'migrations') })`.
- `pnpm payload migrate:create baseline` against a fresh database, capturing `users`, `media` and `coming-soon` as they are now.
- A note in `README.md` on how to mark the baseline as applied on any existing database that was created by push (`payload_migrations` insert), and do this for the existing dev database if there is one.

**Out**

- Roles (T004).

## Acceptance criteria

- [ ] **AC1**: A fresh database migrates from empty.
  - _Verify (db):_ create `amagi_cbhs_t003_fresh`, run `pnpm payload migrate` against it, then `\dt` lists `users`, `media`, `coming_soon` tables and `payload_migrations` has one row named `*baseline*`.
- [ ] **AC2**: Push is disabled.
  - _Verify (code):_ `grep -n "push: false" src/payload.config.ts` matches.
- [ ] **AC3**: No pending schema drift.
  - _Verify (cli):_ `pnpm payload migrate:create drift-check` reports no changes (delete any file it creates).
- [ ] **AC4**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
