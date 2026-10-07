---
id: T011
title: Release 1 pages, content migration, partner announcements and seed script
milestone: M2
release: 1
depends_on: [T007, T009, T017]
migrations: true
requires_human: false
spec: ['SPEC §4.2', 'SPEC §4.4', 'SPEC §5.3', 'SPEC §6.4']
skills: [payload]
---

# T011: Release 1 pages, content migration, partner announcements and seed

## Scope

**In**

- Content in `src/seed/` holding the copy currently hard-coded on `main` (`src/config/placeholderContent.ts`, `src/app/(frontend)/(site)/_content.ts`, `src/app/(frontend)/donate/mockup.ts` and inline page copy), unchanged: pages for Home (slug `home`), About, Support, Call to Action, FAQs, Privacy, Cookies, Terms with the same sections in the same order; news items; FAQs; header, footer and `donation-settings` values; `dropdowns.audienceTypes` (SPEC §5.3); placeholder thank-you copy in the `forms` global for every form key. Header logo, brand title and hero images are taken from the `coming-soon` global.
- A data migration (SPEC §6.4) that applies that content through the Local API, creating each document or global value only if it's missing. This is how the content reaches production.
- `scripts/seed.ts` (`pnpm db:seed`) runs the same content locally.
- The hard-coded page routes, `placeholderContent.ts`, `_content.ts` and the donate copy in `mockup.ts` are deleted; pages, header, footer and donate read Payload. The mockup-only text (mockup banner, simulated checkout) stays until T010 removes the mockup.
- `/` renders the `home` page, publicly (there is no site lock, SPEC §11.1).
- `/news` (news items, newest first) and `/news/[slug]`. Substack posts join `/news` in T028 (Release 2).
- The catch-all route returns 404 for the `home` slug, so Home is only at `/`.
- Partner announcements per SPEC §4.4: Home `newsTeaser` shows latest announcements; partner entries link to their announcements.
- No seed content uses forbidden wording.

**Out**

- Switching off test mode (T018).

## Acceptance criteria

- [ ] **AC1**: Seed and content migration are idempotent.
  - _Verify (db):_ run `pnpm db:seed` twice; `select count(*) from pages` is the same after each run.
- [ ] **AC1b**: The migration doesn't overwrite editors.
  - _Verify (db):_ on a copy of the pulled database, change a page title, delete one FAQ, then re-run the content migration's `up`; the title keeps the edit and only missing documents are created. On a fresh database, `pnpm payload migrate` creates every page.
- [ ] **AC2b**: Pages look the same as before.
  - _Verify (browser):_ screenshots of every page in AC2 at 390px and 1280px match the same pages on `main` (same sections, order and copy).
- [ ] **AC2c**: No hard-coded copy remains.
  - _Verify (code):_ `placeholderContent.ts` and `_content.ts` no longer exist and `grep -rn "TODO: hard-coded" src` returns only mockup-only lines.
- [ ] **AC2**: Every Release 1 page renders.
  - _Verify (browser):_ `/`, `/about`, `/support`, `/call-to-action`, `/faqs`, `/news`, `/privacy`, `/cookies`, `/terms` return 200 with no console errors. Screenshots of each at 390px and 1280px.
- [ ] **AC3**: Every page has a Donate path.
  - _Verify (browser):_ each page in AC2 has at least one `[data-action="donate"]` link to `/donate`.
- [ ] **AC4**: Partner announcements surface in all three places.
  - _Verify (browser):_ publish one partner announcement; it appears on `/news`, in the Home news teaser and on the partner's entry.
- [ ] **AC5**: No forbidden wording.
  - _Verify (code):_ `grep -rniE "sponsor|exhibitor|lead generation" scripts src --include=*.ts --include=*.tsx` returns nothing.
- [ ] **AC6**: No serious accessibility issues.
  - _Verify (browser):_ an `@axe-core/playwright` scan of each page in AC2 reports no serious or critical violations.
- [ ] **AC7**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
