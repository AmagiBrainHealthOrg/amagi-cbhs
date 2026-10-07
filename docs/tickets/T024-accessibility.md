---
id: T024
title: Accessibility audit and fixes
milestone: M5
release: 2
depends_on: [T016, T019, T020, T021, T028]
migrations: false
requires_human: false
spec: ['SPEC §3.2']
skills: []
---

# T024: Accessibility

## Scope

**In**

- Lighthouse accessibility audit (axe-based, run with the system Chrome) of every route; fix every failing audit.
- Keyboard-only walkthrough: navigation, Donate flow up to Stripe, every form.
- Contrast check of all token pairs used for text.
- Findings and fixes listed in the report.

## Acceptance criteria

- [ ] **AC1**: No serious or critical axe violations.
  - _Verify (browser):_ `npx lighthouse <url> --only-categories=accessibility` with the system Chrome reports no failing audits on every route; list each route's score in the report.
- [ ] **AC2**: Keyboard-only flows complete.
  - _Verify (browser):_ a `puppeteer-core` script (system Chrome) using only keyboard input completes a form submission and reaches Stripe Checkout from the Donate button.
- [ ] **AC3**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
