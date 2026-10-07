---
id: T009
title: App shell, components and block renderers
milestone: M1
release: 1
depends_on: [T005, T006, T007, T017]
migrations: false
requires_human: false
spec: ['SPEC §4.1', 'SPEC §6.2', 'SPEC §6.3']
skills: []
---

# T009: App shell, components and block renderers

## Scope

**In**

- Components from SPEC §6.2 in `src/components/`. Button supports `primary`, `secondary`, `tertiary` and requires tracking attributes (`journey`, `action`, `destinationType` props → `data-*`).
- Header (from `header` global) with the Donate button as primary, linking to `/donate`. Accessible mobile navigation.
- Footer (from `footer` global; cookie settings label from `cookie-consent`).
- Block renderers in `src/components/blocks/` for every block in SPEC §6.3 except `video` (T016) and `hostCountriesTeaser` (T020), with a `RenderBlocks` switch. Port them from the current graphics components (`src/app/(frontend)/(site)/_components/`) so the design and CSS stay as they are. The `form` block renders a placeholder until T012; `logoGrid` filters by `permissionConfirmed`.
- Route `src/app/(frontend)/(site)/[slug]/page.tsx` rendering `pages` by slug, with draft preview (`?preview=true` + authenticated) and `RefreshRouteOnSave`. The existing hard-coded page routes stay until T011 replaces them.
- `generateMetadata` from `meta`.
- UTM capture (SPEC §8.1): a small client component in the root layout reads the five `utm_*` parameters on landing and stores them in `sessionStorage` for the visit, with a `getUtm()` helper. Donations (T010) and forms (T012) both read it.
- `not-found` and `error` boundaries using the ErrorState component.
- A dev-only `/dev/kitchen-sink` route rendering every component and block with sample data (returns 404 in production).

**Out**

- Specific page content and removing the hard-coded copy (T011). The site lock (T017) decides what anonymous visitors see.

## Acceptance criteria

- [ ] **AC1**: Every block renders.
  - _Verify (browser):_ `/dev/kitchen-sink` shows each block from SPEC §6.3 with no console errors. Screenshots at 390px and 1280px.
- [ ] **AC2**: Donate is the only primary button in the header.
  - _Verify (browser):_ the header contains exactly one element with the primary button class, labelled from `header.donateLabel`, linking to `/donate`, with `data-action="donate"`.
- [ ] **AC3**: Permission filtering works.
  - _Verify (browser):_ create two supporters, one with `permissionConfirmed: true`; a page with a `logoGrid` block shows only that one.
- [ ] **AC4**: Draft preview works.
  - _Verify (browser):_ an unpublished page returns 404 anonymously and renders for a logged-in editor at `?preview=true`.
- [ ] **AC5**: UTM values survive navigation.
  - _Verify (browser):_ land on `/dev/kitchen-sink?utm_source=test&utm_campaign=c1`, navigate to another page; `getUtm()` in the console returns both values.
- [ ] **AC6**: Kitchen sink is hidden in production.
  - _Verify (cli):_ `NODE_ENV=production pnpm build && pnpm start --port <port>` then `curl -i localhost:<port>/dev/kitchen-sink` returns 404.
- [ ] **AC7**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
