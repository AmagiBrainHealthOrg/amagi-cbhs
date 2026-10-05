---
id: T024
title: Accessibility audit and fixes
milestone: M5
depends_on: [T019, T020, T021, T023]
migrations: false
requires_human: false
spec: ['SPEC §3.2']
skills: []
---

# T024: Accessibility

## Scope

**In**

- `@axe-core/playwright` scan of every route; fix all serious and critical issues.
- Keyboard-only walkthrough: navigation, Donate flow up to Stripe, every form.
- Contrast check of all token pairs used for text.
- Findings and fixes listed in the report.

## Acceptance criteria

- [ ] **AC1**: No serious or critical axe violations.
  - _Verify (browser):_ `tests/e2e/a11y.e2e.spec.ts` scans every route and passes with zero serious/critical violations.
- [ ] **AC2**: Keyboard-only flows complete.
  - _Verify (browser):_ a Playwright script using only keyboard input completes a form submission and reaches Stripe Checkout from the Donate button.
- [ ] **AC3**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
