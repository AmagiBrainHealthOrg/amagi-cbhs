# Orchestrator handover

## Where we are

- Session: 0 (setup only).
- Done: agentic setup files committed.
- In flight: none.
- Parked or blocked: none.

## Ready to start now

- **T001** must be done in a normal session (it creates `pnpm preflight`). After it merges, `/orchestrate` can run.
- After T001: T002, T003 (migration) and T005 can run in parallel. T003 is the only migration ticket in flight.

## Decisions and conventions

- Release 1 (T001–T018) ships on 16 October 2026; Release 2 (T019–T027) date to be confirmed (SPEC §11.3). Release 1 tickets always go first.
- Donations are the primary call to action sitewide (SPEC §2.1).
- Existing users are backfilled to `admin` in T004; new users default to `editor`.
- Copy and dropdown values live in the CMS; seed placeholders are marked `[PLACEHOLDER]`.
- Local databases are named `amagi_cbhs_<id>`; dev server port is `3000 + <numeric id>`.

## Open questions for the user

- D1: hosting provider (blocks T017).
- D2: translation tool (blocks T023).
- D3: territory and industry values (seed placeholders until then).
- D4: is Release 1 public or editor-only (affects T018).
- D5: suggested donation amounts and currency (seed placeholders until then).
- D6: Release 2 date.
