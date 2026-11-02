---
id: T027
title: Full go-live
milestone: M5
release: 2
depends_on: [T024, T025]
migrations: false
requires_human: true
spec: ['SPEC §11.3']
skills: []
---

# T027: Full go-live

## Context

Human steps: Amagi confirms copy, host country content and programme sessions are entered; Beyond Growth confirms the Plausible goals and events on production. Give Beyond Growth two business days' notice before this release.

## Scope

**In**

- Deploy Release 2 to production.
- Smoke test script `scripts/smoke.ts` (moved from T018): hits every Release 1 and Release 2 route, checks for 200s and fails if any page contains `[PLACEHOLDER]`.
- Remove the `coming-soon` global from the config and drop its tables in a migration (SPEC §11.4). First make the T011 content migration and `src/seed/` stop reading it, so a fresh database still migrates.

## Acceptance criteria

- [ ] **AC1**: All routes are live.
  - _Verify (deploy):_ `pnpm tsx scripts/smoke.ts https://amagisummit.org` exits 0 including `/host-countries`, `/programme`, `/get-involved/partner`, `/get-involved/relay`, `/contact`.
- [ ] **AC2**: Production donation and form flows work.
  - _Verify (deploy):_ one production form submission reaches the production Airtable base; one donation creates a `Donations` record via the webhook.
- [ ] **AC3**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
