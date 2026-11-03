---
id: T021
title: Programme schedule and session registration
milestone: M4
release: 2
depends_on: [T009, T020]
migrations: true
requires_human: false
spec: ['SPEC §4.3', 'SPEC §5.1', 'SPEC §9.5']
skills: []
---

# T021: Programme

## Context

Built on `feat/summit-schedule`. Replaces the original `/programme` page with filters and Luma links (dropped 2 November 2026, SPEC §9.5): the programme is a `schedule` block on Summit Week, and in-person sessions register on the site.

## Scope

**In**

- `sessions`, `session-locations` and `session-themes` collections with drafts (SPEC §5.1), and their migration.
- `schedule` block (SPEC §6.3): Overview grid of locations × days, a tab per location, theme filter chips, a day strip below 900px. Online times show in the visitor's zone.
- Sessions with no day, start time or venue are published and shown as TBC.
- `/sessions/[slug]` with the `session-registration` form for in-person sessions; online sessions link to Zoom.
- The CBHS 2026 programme from Amagi (51 sessions, 7 themes) as seed data and a data migration.

**Out**

- Place limits on sessions (editors untick Registration open).
- Luma or Zoom API integration.

## Acceptance criteria

- [x] **AC1**: The schedule lists every published session by location and day.
  - _Verify (browser):_ Summit Week shows the Overview grid with a row per location, a Date TBC column, and theme chips; clicking a row opens that location's tab.
- [x] **AC2**: TBC sessions render.
  - _Verify (unit):_ undated sessions go in the Date TBC column; untimed sessions sort after that day's timed ones.
- [x] **AC3**: In-person sessions register on the site; online ones link to Zoom.
  - _Verify (unit):_ `registerLink` gives `/sessions/[slug]` for in-person and the Zoom URL for online; closed sessions have no link.
- [x] **AC4**: Migrations apply to production's data and from empty.
  - _Verify (db):_ a copy of production migrates and gets 51 published sessions; an empty database migrates, then `pnpm db:seed` twice creates the programme once.
- [x] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0, and `pnpm airtable:check` passes.
