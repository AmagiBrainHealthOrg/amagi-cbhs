---
id: T014
title: Register Interest and Call to Action consultation forms
milestone: M2
release: 1
depends_on: [T011, T013]
migrations: false
requires_human: false
spec: ['SPEC §8.3']
skills: []
---

# T014: Release 1 forms

> **Changed 9 October 2026:** fields per SPEC §8.3 as rewritten for the live Airtable base. Options come from the base, not the CMS.

## Scope

**In**

- Registry definitions for `register-interest` and `cta-consultation` per SPEC §8.3.
- `cta-consultation` displays a clear statement that registering interest is not an endorsement, above the submit button.
- Action-area options for `cta-consultation` come from the base's `Action areas` table through `getFormFields`, not hard-coded. Server validation reads the same list.
- Add the forms to the Home (Register Interest) and Call to Action pages via the seed script.
- Confirmation email templates for both.

**Out**

- Release 2 forms (T019).

## Acceptance criteria

- [ ] **AC1**: Both forms submit end to end.
  - _Verify (browser + db):_ submit each form; a `form-submissions` row exists for each with `airtable_sync_status = 'synced'`, and its record exists in the form's Airtable table with the submitted values, and the thank-you page shows. Submit as "Testy Testerson" and delete the records afterwards.
- [ ] **AC2**: The non-endorsement statement is visible.
  - _Verify (browser):_ on `/call-to-action`, text stating registering is not an endorsement is visible above the submit button.
- [ ] **AC3**: Required fields are enforced server-side.
  - _Verify (api):_ POST each form without `email` returns 400 and creates no row.
- [ ] **AC4**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
