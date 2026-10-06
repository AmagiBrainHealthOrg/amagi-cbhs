---
id: T014
title: Register Interest and Call to Action consultation forms
milestone: M2
release: 1
depends_on: [T013]
migrations: false
requires_human: false
spec: ['SPEC §8.3']
skills: []
---

# T014: Release 1 forms

## Scope

**In**

- Registry definitions for `register-interest` and `cta-consultation` per SPEC §8.3.
- `cta-consultation` displays a clear statement that registering interest is not an endorsement, above the submit button.
- Area-of-interest options for `cta-consultation` come from the `actionAreas` block data on the Call to Action page, or a dedicated field on the `form` block; not hard-coded.
- Add the forms to the Home (Register Interest) and Call to Action pages via the seed script.
- Confirmation email templates for both.

**Out**

- Release 2 forms (T019).

## Acceptance criteria

- [ ] **AC1**: Both forms submit end to end.
  - _Verify (browser + db):_ submit each form; a `form-submissions` row exists for each with `airtable_sync_status = 'synced'`, and its record exists in the test base linked to a `Contacts` record and the thank-you page shows.
- [ ] **AC2**: The non-endorsement statement is visible.
  - _Verify (browser):_ on `/call-to-action`, text stating registering is not an endorsement is visible above the submit button.
- [ ] **AC3**: Required fields are enforced server-side.
  - _Verify (api):_ POST each form without `email` returns 400 and creates no row.
- [ ] **AC4**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
