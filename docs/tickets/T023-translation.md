---
id: T023
title: Automated translation
milestone: M4
release: 2
depends_on: [T018]
migrations: false
requires_human: true
spec: ['SPEC §12', 'SPEC §14 D2']
skills: []
---

# T023: Translation

## Context

Human steps: Amagi chooses the translation tool (D2) and provides its key or embed code. Write the chosen tool into SPEC §12 in this PR.

## Scope

**In**

- Integrate the chosen tool for Spanish, French, Dutch and Haitian Creole, with an accessible language switcher in the header.
- Exclude from translation: form field `value`s, data attributes, the data layer, and the Donate amount values.
- Set `lang` on `<html>` (or translated containers) to the active language.

## Acceptance criteria

- [ ] **AC1**: Each language renders.
  - _Verify (browser):_ switching to each of the four languages translates visible copy on `/` and `/support`; screenshots at 390px and 1280px show no layout breakage.
- [ ] **AC2**: Tracking and forms survive translation.
  - _Verify (browser):_ in French, a form submission still stores English `value`s for territory and audience type, and data attributes are unchanged.
- [ ] **AC3**: Language is exposed to assistive tech.
  - _Verify (browser):_ the `lang` attribute matches the active language.
- [ ] **AC4**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
