---
id: T003
title: Switch to migrations and create the baseline
milestone: M0
release: 1
depends_on: [T001]
migrations: true
requires_human: true
spec: ['SPEC §11.2']
skills: [payload]
---

# T003: Switch to migrations and create the baseline

## Context

The Postgres adapter currently pushes schema in development. Every later ticket ships migrations, so we need a baseline that matches the current schema.

Human step: the user runs the two marker statements below against staging after reviewing them. It is the one sanctioned write to a remote database.

## Scope

**In**

- `postgresAdapter({ push: false, migrationDir: path.resolve(dirname, 'migrations') })`.
- `pnpm payload migrate:create --skip-empty baseline` against a fresh local database, capturing `users`, `media` and `coming-soon` as they are now.
- Mark the baseline as applied on staging, which was created by push: `delete from payload_migrations where batch = -1` (the dev-push marker, which otherwise makes `migrate` stop and ask) and insert the baseline row. Document both statements in `README.md`.
- `pnpm db:pull` ends with `pnpm payload migrate`.

**Out**

- Roles (T004).

## Acceptance criteria

- [ ] **AC1**: A fresh database migrates from empty.
  - _Verify (db):_ create `amagi_cbhs_t003_fresh`, run `pnpm payload migrate` against it, then `\dt` lists `users`, `media`, `coming_soon` tables and `payload_migrations` has one row named `*baseline*`.
- [ ] **AC2**: Push is disabled.
  - _Verify (code):_ `grep -n "push: false" src/payload.config.ts` matches.
- [ ] **AC3**: No pending schema drift.
  - _Verify (cli):_ `pnpm payload migrate:create --skip-empty drift-check` creates no file.
- [ ] **AC4**: A pulled database migrates without prompting.
  - _Verify (cli):_ after the staging marker fix, `pnpm db:pull` completes, including its `pnpm payload migrate` step, with no prompt; `select batch from payload_migrations where batch = -1` locally returns no rows.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
