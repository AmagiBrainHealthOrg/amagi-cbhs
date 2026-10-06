# Orchestrator handover

## Where we are

- Session: 0 (setup only).
- Done: agentic setup files committed.
- In flight: none.
- Parked or blocked: none.

## Ready to start now

- **T001** must be done in a normal session (it creates `pnpm preflight`). After it merges, `/orchestrate` can run.
- After T001: T002, T003 (migration) and T005 can run in parallel. T003 is the only migration ticket in flight.
- After T003: T017 (production lock and health check) and T004 (migration) can run in parallel.

## Decisions and conventions

- Release 1 (T001–T015, T017, T018) ships on 16 October 2026; Release 2 (T016, T019–T022, T024–T028) date to be confirmed (SPEC §11.3). Release 1 tickets always go first.
- Hosting: Vercel (Tandem Hobby until launch, Amagi Pro from T018) with Supabase Postgres and Storage (SPEC §11.2).
- No staging and no preview deployments. Every merge to `main` deploys to production, which is locked (`SITE_LOCKED`) and in test mode (`SITE_LIVE` unset) until launch. Amagi reviews new work as draft pages while logged in (SPEC §11.1).
- Local development runs on the Supabase CLI; `pnpm db:pull` copies production schema and data down, one way (SPEC §11.5). Agents never touch remotes.
- Form submissions and donations go straight to Airtable, Amagi's CRM; no Google Sheets. Payload keeps every submission as the record and retry queue (SPEC §9.1).
- Donations are the primary call to action sitewide (SPEC §2.1).
- Existing users are backfilled to `admin` in T004; new users default to `editor`.
- Copy and dropdown values live in the CMS; seed placeholders are marked `[PLACEHOLDER]`.
- Local databases are named `amagi_cbhs_<id>`; dev server port is `3000 + <numeric id>`.

## Open questions for the user

- D3: territory and industry values (seed placeholders until then).
- D4: is Release 1 public or editor-only (affects T018).
- D5: suggested donation amounts and currency (seed placeholders until then).
- D6: Release 2 date.
- D7: Airtable base structure and field list (blocks T013).
- D8: whether donor name and email go to Airtable (affects T022).
- D9: after launch, whether merges keep deploying straight to production (affects T018).
