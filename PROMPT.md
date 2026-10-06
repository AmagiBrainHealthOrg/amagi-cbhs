# Orchestrator handover

## Where we are

- Done: T001 (#9), T002, T003 (#11), T005 (#12); Vercel deploy fix (#13; production builds run again); donation mockup (#14).
- In flight: T004 and T017, left as uncommitted work in `.claude/worktrees/agent-a7fcc53c109a3d48b` (T004: role field, migration, access helpers) and `.claude/worktrees/agent-afd50bb3287dc0302` (T017: worktree is corrupted, almost every file deleted; re-dispatch fresh).
- Parked or blocked: none.

## Ready to start now

- Finish T004 (migration) from its worktree, and re-dispatch T017 fresh; they can run in parallel.
- **T029** (Airtable base design) has no dependencies: start it so Amagi can sign off D7 before T013.
- After T004: T006 (migration), then T007, then T009 (also needs T017).

## Decisions and conventions

- Release 1 (T001–T015, T017, T018, T029, T030) ships on 16 October 2026; Release 2 (T016, T019–T022, T024–T028) date to be confirmed (SPEC §11.3). Release 1 tickets always go first.
- Hosting: Vercel (Tandem Hobby until launch, Amagi Pro from T018) with Supabase Postgres and Storage (SPEC §11.2).
- No staging and no preview deployments. Every merge to `main` deploys to production, which is locked (`SITE_LOCKED`) and in test mode (`SITE_LIVE` unset) until launch. Amagi reviews new work as draft pages while logged in (SPEC §11.1).
- Local development runs on the Supabase CLI; `pnpm db:pull` copies production schema and data down, one way (SPEC §11.5). Agents never touch remotes.
- Form submissions and donations go straight to Airtable, Amagi's CRM; no Google Sheets. Payload keeps every submission as the record and retry queue (SPEC §9.1).
- Donations are the primary call to action sitewide (SPEC §2.1).
- Cookie consent is in Release 1: Google Tag Manager loads only after the visitor accepts analytics (SPEC §10.5, T030).
- Existing users are backfilled to `admin` in T004; new users default to `editor`.
- Copy and dropdown values live in the CMS; seed placeholders are marked `[PLACEHOLDER]`.
- Local databases are named `amagi_cbhs_<id>`; dev server port is `3000 + <numeric id>`.
- Under the Claude Code sandbox, local ports, Docker and `pg_dump` to production need the sandbox bypass; run `tsx` scripts as `node --import tsx scripts/<name>.ts` and the Supabase CLI with `DO_NOT_TRACK=1`.
- Browser checks use the system Chrome: `chromium.launch({ channel: 'chrome' })`.
- No favicon yet (browsers log a `/favicon.ico` 404); pick it up in T009.
- `/donate`, `/donate/checkout` and `/donate/thank-you` are a mockup (#14): hard-coded amounts and copy in `donate/mockup.ts`, a placeholder checkout with no payment inputs, noindex and a Mockup banner. T010 replaces it with `donation-settings` (T006) and real Stripe Checkout; delete `mockup.ts` and `checkout/` then.

## Open questions for the user

- D3: territory and industry values (seed placeholders until then).
- D4: is Release 1 public or editor-only (affects T018).
- D5: suggested donation amounts and currency (seed placeholders until then).
- D6: Release 2 date.
- D7: Airtable base structure and field list (T029 drafts it; blocks T013).
- D8: whether donor name and email go to Airtable (affects T022).
- White text on `--orange` (the sitewide Donate button) is 2.37:1, below WCAG AA 4.5:1. Darken the orange, use dark text, or make the label large bold text? Needs a design decision (Heather Kong).
- D9: after launch, whether merges keep deploying straight to production (affects T018).
