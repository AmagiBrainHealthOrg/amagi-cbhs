---
id: T026
title: End-to-end suite
milestone: M5
release: 2
depends_on: [T019, T020, T021, T022]
migrations: false
requires_human: false
spec: ['PLAN §5.2']
skills: []
---

# T026: End-to-end suite

## Scope

**In**

- Playwright specs: every form (submit, validation, consent capture); donation flow in Stripe test mode through to the thank-you page; editor vs admin permissions in the admin; draft preview; partner announcement surfacing.
- `.github/workflows/e2e.yml` running the suite on pull requests against a built app and a CI Postgres, with Stripe test keys and an Airtable mock (`AIRTABLE_MODE=mock` records writes in the database instead).

## Acceptance criteria

- [ ] **AC1**: The suite passes locally.
  - _Verify (cli):_ `pnpm test:e2e` exits 0; list spec names in the report.
- [ ] **AC2**: The suite runs in CI.
  - _Verify (deploy):_ `gh pr checks <n>` shows the e2e job passed.
- [ ] **AC3**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
