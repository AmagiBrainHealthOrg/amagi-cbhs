---
id: T021
title: Programme page with filters
milestone: M4
release: 2
depends_on: [T008, T009]
migrations: false
requires_human: false
spec: ['SPEC §4.3', 'SPEC §9.5']
skills: []
---

# T021: Programme

## Scope

**In**

- `/programme`: sessions grouped by day; filters for stream, day, territory and format, driven by URL search params (shareable, works without JavaScript via a form GET).
- Each session links to `lumaUrl` as an outbound, tracked link.
- Empty state when filters match nothing.

## Acceptance criteria

- [ ] **AC1**: Filters work with and without JavaScript.
  - _Verify (browser):_ selecting territory `jamaica` and format `online` shows only matching sessions and updates the URL; loading that URL directly with JavaScript disabled shows the same results.
- [ ] **AC2**: Luma links are tracked outbound links.
  - _Verify (browser):_ each session link has `data-destination-type="luma"` and opens the Luma URL.
- [ ] **AC3**: Empty state renders.
  - _Verify (browser):_ a filter combination with no sessions shows the empty state.
- [ ] **AC4**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
