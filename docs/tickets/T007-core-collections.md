---
id: T007
title: 'Collections: pages (blocks), news, partners, supporters, FAQs'
milestone: M1
release: 1
depends_on: [T006]
migrations: true
requires_human: false
spec: ['SPEC §5.1', 'SPEC §6.3', 'SPEC §4.4', 'SPEC §6.4']
skills: [payload]
---

# T007: Core collections

## Scope

**In**

- Collections `pages`, `news`, `partners`, `supporters`, `faqs` per SPEC §5.1, with drafts, autosave and live preview.
- Block configs in `src/blocks/` for every block in SPEC §6.3 except `video` (T016) and `hostCountriesTeaser` (T020), both Release 2 (schema only; renderers come in T009). The blocks are shaped to hold everything the current pages on `main` render, so T011 can move that copy across unchanged. The shared section fields live in one helper (`src/fields/section.ts`) and the icon options in `src/config/icons.ts`. The `form` block holds a select of all five form keys from SPEC §8.3, Release 2 keys included (SPEC §8.3 explains why), and no thank-you copy (that's the `forms` global).
- Slug field helper (`src/fields/slug.ts`), unique and indexed.
- `news.partner` relationship, required when `type` is `partner-announcement`.
- `permissionConfirmed` on partners and supporters, default `false`.
- Access via `src/access/` helpers.
- `afterChange` revalidation of affected paths.
- Migration.

**Out**

- Rendering (T009, T011).

## Acceptance criteria

- [ ] **AC1**: Collections exist with the specified fields.
  - _Verify (api):_ as admin, create one document in each collection via REST; each returns 201.
- [ ] **AC1b**: Blocks hold the current content.
  - _Verify (api):_ as admin, create a page whose `layout` uses every block from AC scope with the Home and Support copy from `main`; it returns 201 and reads back unchanged.
- [ ] **AC2**: Partner announcements require a partner.
  - _Verify (api):_ creating a `news` item with `type: partner-announcement` and no partner returns 400; with a partner it returns 201.
- [ ] **AC3**: Anonymous users see only published documents.
  - _Verify (api):_ create a draft page; anonymous `GET /api/pages?where[slug][equals]=<slug>` returns 0 docs; after publishing it returns 1.
- [ ] **AC4**: Slugs are unique.
  - _Verify (api):_ creating a second page with the same slug returns 400.
- [ ] **AC5**: Migration applies from empty.
  - _Verify (db):_ fresh database migrates; tables exist.
- [ ] **AC6**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
