---
id: T008
title: 'Collections: host countries, sessions, Substack posts, form submissions'
milestone: M1
release: 1
depends_on: [T007]
migrations: true
requires_human: false
spec: ['SPEC §5.1']
skills: [payload]
---

# T008: Supporting collections

## Scope

**In**

- Collections `host-countries`, `sessions`, `substack-posts`, `form-submissions` per SPEC §5.1.
- `territory` fields on host countries and sessions validate against `dropdowns.territories` values.
- `form-submissions`: admin-only for every operation; `data` as JSON; `consents` group of three checkboxes; `utm` group of five text fields; `isTest`; `sheetSyncStatus` default `pending`; `sheetSyncError`. No drafts.
- `substack-posts.url` unique; `approved` default `false`.
- Migration.

**Out**

- Sheets sync hook (T013). Substack job (T016).

## Acceptance criteria

- [ ] **AC1**: Collections exist with the specified fields.
  - _Verify (api):_ as admin, create one document in each; each returns 201.
- [ ] **AC2**: Form submissions are admin-only.
  - _Verify (api):_ editor and anonymous `GET /api/form-submissions` return 403; admin returns 200.
- [ ] **AC3**: Territory validation works.
  - _Verify (api):_ with `dropdowns.territories` set to `[{label:"Jamaica",value:"jamaica"}]`, creating a session with `territory: "mars"` returns 400 and with `"jamaica"` returns 201.
- [ ] **AC4**: Migration applies from empty.
  - _Verify (db):_ fresh database migrates; tables exist.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
