---
id: T008
title: 'Collection: form submissions'
milestone: M1
release: 1
depends_on: [T007]
migrations: true
requires_human: false
spec: ['SPEC §5.1']
skills: [payload]
---

# T008: Form submissions collection

## Scope

**In**

- `form-submissions` per SPEC §5.1: admin-only for every operation; `form` (select of all five form keys, SPEC §8.3); `data` as JSON (name, email, the optional `phone` from SPEC §8.1 and each form's extra fields); `territory` and `audienceType` (text: values come from the `dropdowns` global); `consents` group of three checkboxes; `utm` group of five text fields; `isTest`; `airtableSyncStatus` default `pending`; `airtableSyncError`; `airtableRecordId`. No drafts.
- Migration.

**Out**

- Airtable sync (T013). `host-countries` (T020) and `sessions` (T021), both Release 2. `substack-posts` (T028, Release 2).

## Acceptance criteria

- [ ] **AC1**: The collection exists with the specified fields.
  - _Verify (api):_ as admin, create one document; it returns 201.
- [ ] **AC2**: Form submissions are admin-only.
  - _Verify (api):_ editor and anonymous `GET /api/form-submissions` return 403; admin returns 200.
- [ ] **AC3**: Migration applies from empty.
  - _Verify (db):_ fresh database migrates; the table exists.
- [ ] **AC4**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
