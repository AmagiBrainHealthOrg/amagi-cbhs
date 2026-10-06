---
id: T019
title: Partner, Relay and Contact/media forms
milestone: M4
release: 2
depends_on: [T014]
migrations: false
requires_human: false
spec: ['SPEC §8.3']
skills: []
---

# T019: Release 2 forms

## Scope

**In**

- Registry definitions for `partner`, `relay`, `contact` per SPEC §8.3 (their keys are already in the schema, so no migration), with routes `/get-involved/partner`, `/get-involved/relay`, `/contact` as `pages` with a `form` block (via seed).
- `partner` is an organisation form (industry shown).
- `relay` writes `territory` as its own field, so each country lead can have a filtered Airtable view.
- `contact` shows `outlet` only when enquiry type is `media`.
- Confirmation email templates.

## Acceptance criteria

- [ ] **AC1**: All three forms submit end to end.
  - _Verify (browser + db):_ each submission creates a synced `form-submissions` row and shows its thank-you page.
- [ ] **AC2**: Conditional field works.
  - _Verify (browser):_ `outlet` is hidden for `general` and visible and required for `media`; server rejects `media` without `outlet`.
- [ ] **AC3**: Relay records carry territory.
  - _Verify (cli):_ reading the latest `relay` record through `src/lib/airtable.ts` shows the submitted territory value.
- [ ] **AC4**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
