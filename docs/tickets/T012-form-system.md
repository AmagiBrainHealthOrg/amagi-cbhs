---
id: T012
title: Shared form system
milestone: M2
release: 1
depends_on: [T008, T009, T017]
migrations: true
requires_human: false
spec: ['SPEC §8.1', 'SPEC §8.2', 'SPEC §8.4']
skills: []
---

# T012: Shared form system

## Scope

**In**

- `src/components/forms/`: `Form`, field components (text, email, textarea, select, checkbox), shared fields (territory, audience type, industry, three consents, UTM hidden fields, honeypot).
- `src/forms/registry.ts`: form definitions keyed by SPEC §8.3 keys, each with a Zod schema, field list and whether it's an organisation form. Only the shape is needed now; T014 and T019 add definitions.
- Inject UTM values from T009's `getUtm()` into every form as hidden fields.
- `POST /api/forms/[key]`: validate with the registry schema, honeypot check, rate limit (SPEC §8.2) counted in a new `rate_limits` table (hashed IP, window start, count; migration), create `form-submissions` (`isTest` when not `isLive()`, SPEC §11.1), redirect to `/thank-you/[key]` with `territory` and `audience_type` per SPEC §8.2.
- `/thank-you/[key]` page using copy from the `forms` global (SPEC §8.4).
- A link to `/privacy` beside the consent checkboxes (SPEC §4.2).
- Accessible validation (client and server), focus to first error.
- The `form` block now renders the selected form.
- A test-only form definition `test-form` used by this ticket's ACs, available only when `NODE_ENV !== 'production'`.

**Out**

- Airtable and email (T013). Real form definitions (T014, T019). Tracking events (T015).

## Acceptance criteria

- [ ] **AC1**: Valid submissions are stored with UTM and consents.
  - _Verify (browser + db):_ visit `/dev/kitchen-sink?utm_source=test&utm_campaign=c1`, submit `test-form` with one consent ticked; `select data, utm, consents, is_test from form_submissions order by id desc limit 1` shows the UTM values, the one consent true and `is_test` true.
- [ ] **AC2**: Invalid submissions are rejected accessibly.
  - _Verify (browser):_ submitting empty required fields shows errors linked by `aria-describedby`, sets `aria-invalid`, focuses the first invalid field, and creates no row.
- [ ] **AC3**: Honeypot and rate limit work.
  - _Verify (api):_ a POST with the honeypot filled returns a redirect but creates no row; the 6th valid POST from one IP within 10 minutes returns 429, and the first 5 succeeded.
- [ ] **AC4**: Consents are unticked by default and independent.
  - _Verify (browser):_ all three checkboxes render unchecked; ticking one leaves the others unchecked.
- [ ] **AC5**: No health fields exist in any form definition.
  - _Verify (code):_ `grep -rniE "diagnos|symptom|medical|health history|condition" src/forms` returns nothing.
- [ ] **AC6**: Migration applies from empty.
  - _Verify (db):_ fresh database migrates; the rate-limit table exists.
- [ ] **AC7**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
