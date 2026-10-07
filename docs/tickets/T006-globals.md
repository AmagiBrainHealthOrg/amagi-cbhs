---
id: T006
title: 'Globals: header, footer, donation settings, anchor day, dropdowns, integrations, forms, cookie consent'
milestone: M1
release: 1
depends_on: [T004]
migrations: true
requires_human: false
spec: ['SPEC §5.2', 'SPEC §5.3']
skills: [payload]
---

# T006: Globals

## Scope

**In**

- Globals `header`, `footer`, `donation-settings`, `anchor-day`, `dropdowns`, `integrations`, `forms`, `cookie-consent` per SPEC §5.2, with drafts and live preview (except `integrations`, which has no drafts). This includes the fields that hold the current site's copy: `header.brandTitle`, `footer.tagline`, and the `page`, `unconfirmed*` and `banner` copy on `donation-settings`.
- Access: `integrations` admin-only for read and update; others readable publicly (published only) and editable by admins and editors.
- `src/lib/dropdowns.ts`: `getDropdowns()` returning typed `{ territories, audienceTypes, industries }`, cached per request.
- Migration.

**Out**

- Frontend rendering (T009). Seed values and the content migration (T011). Substack fields on `integrations` (T028, Release 2).

## Acceptance criteria

- [ ] **AC1**: All eight globals exist with the specified fields.
  - _Verify (api):_ as admin, `GET /api/globals/<slug>` returns 200 for each slug; field names match SPEC §5.2.
- [ ] **AC2**: Integrations are admin-only.
  - _Verify (api):_ anonymous and editor `GET /api/globals/integrations` return 403 or an empty result; admin gets the document.
- [ ] **AC3**: `getDropdowns()` returns typed values.
  - _Verify (unit):_ `tests/int/dropdowns.int.spec.ts` sets values via the Local API and asserts the returned shape.
- [ ] **AC4**: Migration applies from empty.
  - _Verify (db):_ on a fresh database, `pnpm payload migrate` succeeds and the global tables exist.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
