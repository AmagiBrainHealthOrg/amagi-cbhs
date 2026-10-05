---
id: T025
title: Performance pass
milestone: M5
release: 2
depends_on: [T019, T020, T021]
migrations: false
requires_human: false
spec: ['SPEC §3.3']
skills: []
---

# T025: Performance

## Scope

**In**

- Lighthouse (mobile, Slow 4G) on Home, Support, a news item, a host country and the programme; fix regressions against SPEC §3.3 targets.
- Image sizing, font loading, client bundle trimming, caching headers for static assets.

## Acceptance criteria

- [ ] **AC1**: Targets met.
  - _Verify (cli):_ `npx lighthouse <url> --preset=perf --form-factor=mobile --throttling-method=simulate --output=json` on each page shows LCP < 2.5s and CLS < 0.1. Record values in the report.
- [ ] **AC2**: JavaScript budget met.
  - _Verify (cli):_ the build output shows first-load JS for content routes under 150 KB gzipped.
- [ ] **AC3**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
