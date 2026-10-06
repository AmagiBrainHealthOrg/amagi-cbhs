---
id: T020
title: Host Countries index and profiles
milestone: M4
release: 2
depends_on: [T009, T011, T019]
migrations: true
requires_human: false
spec: ['SPEC §4.3', 'SPEC §5.1', 'SPEC §6.3']
skills: []
---

# T020: Host Countries

## Scope

**In**

- `host-countries` collection per SPEC §5.1, with drafts; `territory` validates against `dropdowns.territories`.
- `hostCountriesTeaser` block config and renderer, added to the `pages` layout.
- Migration.
- `/host-countries`: grid of published host countries.
- `/host-countries/[slug]`: profile template (country lead with photo and bio, week overview, activities, local partner logos, Relay form block pre-filled with the country's territory, Donate banner).
- Page context sets `territory` to the country's value.
- `hostCountriesTeaser` block on Home links here.
- Seed five placeholder countries.

## Acceptance criteria

- [ ] **AC1**: Index and profiles render.
  - _Verify (browser):_ `/host-countries` lists 5 countries; each profile returns 200 with no console errors. Screenshots at 390px and 1280px.
- [ ] **AC2**: Scales to ten.
  - _Verify (browser):_ with 10 published countries, the index shows all 10 without layout breakage at 390px.
- [ ] **AC3**: Territory context is correct.
  - _Verify (browser):_ on a profile, `window.dataLayer[0].territory` equals the country's territory value, and the Relay form's territory is pre-selected.
- [ ] **AC4**: Territory validation works.
  - _Verify (api):_ with `dropdowns.territories` set to `[{label:"Jamaica",value:"jamaica"}]`, creating a host country with `territory: "mars"` returns 400 and with `"jamaica"` returns 201.
- [ ] **AC5**: Migration applies from empty.
  - _Verify (db):_ fresh database migrates; the tables exist.
- [ ] **AC6**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
