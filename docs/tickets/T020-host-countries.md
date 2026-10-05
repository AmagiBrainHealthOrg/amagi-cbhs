---
id: T020
title: Host Countries index and profiles
milestone: M4
release: 2
depends_on: [T008, T009]
migrations: false
requires_human: false
spec: ['SPEC §4.3', 'SPEC §5.1']
skills: []
---

# T020: Host Countries

## Scope

**In**

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
- [ ] **AC4**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
