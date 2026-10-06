---
id: T003
title: Switch to migrations, create the baseline and migrate on deploy
milestone: M0
release: 1
depends_on: [T001]
migrations: true
requires_human: true
spec: ['SPEC §11.2']
skills: [payload]
---

# T003: Switch to migrations, create the baseline and migrate on deploy

## Context

The Postgres adapter currently pushes schema in development. Every later ticket ships migrations, so we need a baseline that matches the current schema, and production deployments must apply migrations before they build. Without the deploy step, the first schema change after this ticket (T004) would break production.

Human step: the user runs the two marker statements below against the production database after reviewing them. It is the one sanctioned write to a remote database.

## Scope

**In**

- `postgresAdapter({ push: false, migrationDir: path.resolve(dirname, 'migrations') })`.
- `pnpm payload migrate:create --skip-empty baseline` against a fresh local database, capturing `users`, `media` and `coming-soon` as they are now.
- A second migration, `enable_rls`, enabling row-level security on every table in `public` (idempotent; loops over `pg_tables`), per SPEC §11.2. It runs on production because only the baseline is marked as applied there.
- Mark the baseline as applied on production, which was created by push: `delete from payload_migrations where batch = -1` (the dev-push marker, which otherwise makes `migrate` stop and ask) and insert the baseline row. Document both statements in `README.md`.
- `vercel.json` `buildCommand`: `pnpm payload migrate && pnpm build`. Keep the existing `ignoreCommand`. Local `pnpm build` never migrates.
- `pnpm db:pull` ends with `pnpm payload migrate`.

**Out**

- Roles (T004).

## Acceptance criteria

- [ ] **AC1**: A fresh database migrates from empty.
  - _Verify (db):_ create `amagi_cbhs_t003_fresh`, run `pnpm payload migrate` against it, then `\dt` lists `users`, `media`, `coming_soon` tables, `payload_migrations` has rows for `*baseline*` and `*enable_rls*`, and `select count(*) from pg_tables where schemaname = 'public' and not rowsecurity` returns 0.
- [ ] **AC2**: Push is disabled.
  - _Verify (code):_ `grep -n "push: false" src/payload.config.ts` matches.
- [ ] **AC3**: No pending schema drift.
  - _Verify (cli):_ `pnpm payload migrate:create --skip-empty drift-check` creates no file.
- [ ] **AC4**: The baseline matches production's schema.
  - _Verify (db):_ after the marker fix and `pnpm db:pull`, `pg_dump --schema-only --schema=public` of the pulled database and of `amagi_cbhs_t003_fresh` differ only in `payload_migrations` rows and row-level security; list any other difference in the report.
- [ ] **AC5**: A pulled database migrates without prompting.
  - _Verify (cli):_ `pnpm db:pull` completes, including its `pnpm payload migrate` step, with no prompt; `select batch from payload_migrations where batch = -1` locally returns no rows.
- [ ] **AC6**: Production migrates on deploy.
  - _Verify (deploy, after merge):_ the Vercel build log shows `payload migrate` applying `enable_rls` before `next build`; `curl -s "https://<ref>.supabase.co/rest/v1/users?select=*" -H "apikey: <anon key>"` returns no rows.
- [ ] **AC7**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
