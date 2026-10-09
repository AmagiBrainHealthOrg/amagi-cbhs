---
id: T029
title: Airtable base design for sign-off
milestone: M0
release: 1
depends_on: []
migrations: false
requires_human: true
spec: ['SPEC §8.3', 'SPEC §9.1', 'SPEC §13 D7']
skills: []
---

# T029: Airtable base design for sign-off

> **Closed 9 October 2026:** Amagi built the base, and the base as built is the source of truth (SPEC §9.1). `docs/AIRTABLE.md` now describes it, and `pnpm airtable:check` passes against it. The design-for-sign-off below no longer applies.

## Context

T013 can't finish until Amagi signs off the base structure (D7), and T013 is on the Release 1 critical path. Writing the design now gives Amagi time to review it while the rest of the build continues.

Human steps: send `docs/AIRTABLE.md` to Amagi, record their sign-off (or changes) in the report, then build the test base from it.

## Scope

**In**

- `docs/AIRTABLE.md`: the base structure from SPEC §9.1, table by table and field by field, with Airtable field types: `Contacts`, one table per form key in SPEC §8.3 (Release 2 forms included, so the base is built once), and `Donations`. Mark which fields are linked records, which are written by the site, and which Amagi may add freely.
- Steps for creating a personal access token scoped to one base (`data.records:read`, `data.records:write`, `schema.bases:read`).

**Out**

- `src/config/airtable.ts` and every line of code (T013).

## Acceptance criteria

- [ ] **AC1**: The design covers every field the site writes.
  - _Verify (code):_ every field in SPEC §8.1, §8.3 and §7 step 5 appears in `docs/AIRTABLE.md`, with a field type.
- [ ] **AC2**: Amagi has signed it off.
  - _Verify (cli):_ the report quotes the sign-off, with its date, or lists the changes Amagi asked for and shows them applied.
