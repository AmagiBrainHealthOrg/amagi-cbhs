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

> **Built 9 October 2026** on `feat/forms`, with T012, T014 and T019 together. All five forms are on pages (`/register`, `/call-to-action`, `/partner`, `/relay`, `/contact`) and sync to Airtable. Deviations: forms post to a Server Action, not `POST /api/forms/[key]`, so the rate limit shows a message instead of a 429; there is no `test-form` or kitchen-sink form, because the real forms were tested end to end; the Release 2 pages are `/partner`, `/relay` and `/contact` (the page route has one level); confirmation emails stay in T013.

# T019: Release 2 forms

## Scope

**In**

- Registry definitions for `partner`, `relay`, `contact` per SPEC §8.3 (their keys are already in the schema, so no migration), with routes `/get-involved/partner`, `/get-involved/relay`, `/contact` as `pages` with a `form` block (via seed).
- `partner` is an organisation form (industry shown).
- Fields per SPEC §8.3. `relay`'s activity date is limited to 16–22 November 2026.
- `contact` shows `outlet` only when enquiry type is `media`.
- Confirmation email templates.

## Acceptance criteria

- [ ] **AC1**: All three forms submit end to end.
  - _Verify (browser + db):_ each submission creates a synced `form-submissions` row and shows its thank-you page.
- [ ] **AC2**: Conditional field works.
  - _Verify (browser):_ `outlet` is hidden for `general` and visible and required for `media`; server rejects `media` without `outlet`.
- [ ] **AC3**: Relay records carry the location.
  - _Verify (cli):_ the latest record in `Propose a Brain Health Relay activity` links the submitted `Country / location`.
- [ ] **AC4**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
