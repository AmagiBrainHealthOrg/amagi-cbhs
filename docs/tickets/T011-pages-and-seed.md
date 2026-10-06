---
id: T011
title: Release 1 pages, partner announcements and seed script
milestone: M2
release: 1
depends_on: [T007, T008, T009, T017]
migrations: false
requires_human: false
spec: ['SPEC §4.2', 'SPEC §4.4', 'SPEC §5.3']
skills: [payload]
---

# T011: Release 1 pages, partner announcements and seed

## Scope

**In**

- `scripts/seed.ts` (`pnpm db:seed`): idempotent; creates `pages` for Home (slug `home`), About, Support, Call to Action, FAQs (a `faqList` block grouped by category), Privacy, Cookies, Terms with sensible block layouts and placeholder copy marked `[PLACEHOLDER]`; seeds `dropdowns.audienceTypes` (SPEC §5.3), placeholder territories and industries, placeholder `donation-settings` amounts; header and footer; placeholder thank-you copy in the `forms` global for every form key.
- `/` renders the `home` page. Anonymous visitors still see Coming Soon in production while the site is locked (T017).
- `/news` (news items, newest first) and `/news/[slug]`. Substack posts join `/news` in T028 (Release 2).
- The catch-all route returns 404 for the `home` slug, so Home is only at `/`.
- Partner announcements per SPEC §4.4: Home `newsTeaser` shows latest announcements; partner entries link to their announcements.
- No seed content uses forbidden wording.

**Out**

- Unlocking the site (T018).

## Acceptance criteria

- [ ] **AC1**: Seed is idempotent.
  - _Verify (db):_ run `pnpm db:seed` twice; `select count(*) from pages` is the same after each run.
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
