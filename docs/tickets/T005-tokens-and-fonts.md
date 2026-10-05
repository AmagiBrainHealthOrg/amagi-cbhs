---
id: T005
title: Design tokens and fonts
milestone: M1
depends_on: [T001]
migrations: false
requires_human: false
spec: ['SPEC §6.1', 'SPEC §3.3']
skills: []
---

# T005: Design tokens and fonts

## Scope

**In**

- Split `src/app/(frontend)/styles.css` into `tokens.css` (custom properties only), `base.css` (reset, typography, focus, skip link, reduced motion) and the existing Coming Soon rules.
- Load Baloo 2, Montserrat and Roboto via `next/font/google`, exposed as the existing `--app-font-*` variables. Remove the Google Fonts `<link>` tags.
- Keep the Adobe Fonts kit for All Round Gothic, with a fallback stack, loaded with `display=swap`.
- Global focus style meeting WCAG 2.1 AA.
- `prefers-reduced-motion`: disable the Coming Soon crossfade.

**Out**

- Components (T009).

## Acceptance criteria

- [ ] **AC1**: No Google Fonts stylesheet links remain.
  - _Verify (code):_ `grep -rn "fonts.googleapis.com" src` returns nothing.
- [ ] **AC2**: Fonts render correctly.
  - _Verify (browser):_ on `/`, computed `font-family` of body text includes Baloo 2 and of the `h1` includes Montserrat. Screenshots at 390px and 1280px.
- [ ] **AC3**: Reduced motion is respected.
  - _Verify (browser):_ with `reducedMotion: 'reduce'`, background images have no running animation.
- [ ] **AC4**: Components use tokens only.
  - _Verify (code):_ `grep -rnE "#[0-9a-fA-F]{3,6}" src/app/\(frontend\) --include=*.css | grep -v tokens.css` returns nothing.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
