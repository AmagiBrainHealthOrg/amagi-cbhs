---
paths:
  - 'src/components/**'
  - 'src/app/(frontend)/**/*.tsx'
  - 'src/app/(frontend)/**/*.css'
---

# Design System Rules

Spec: `docs/SPEC.md` §6.

## Tokens only

- Colours, fonts, spacing and radii come from the CSS custom properties in `src/app/(frontend)/styles.css` (ported from the previous site). Never use raw hex values in components.
- Brand colours: primary blue `--primary-blue`, orange `--orange`, yellow `--yellow`, red `--red`.
- Fonts: body `--app-font-body` (Baloo 2), headings `--app-font-heading` (Montserrat), UI `--app-font-ui` (Roboto), key statements `--app-font-key-statement` (All Round Gothic).

## Buttons

- **Donate is the primary button sitewide.** It uses the primary button style and appears in the header and on every page.
- Every other action uses secondary or tertiary styling. Never style two actions as primary in the same section.
- Every CTA button and outbound link carries `data-journey`, `data-action` and `data-destination-type` (see `forms-and-tracking.md`).

## Layout and blocks

- Pages are built from fixed blocks rendered by `src/components/blocks/`. Editors fill in fields; they cannot change layout.
- Mobile first. Test at 390px and 1280px.

## Accessibility

- WCAG 2.1 AA: semantic HTML, one `h1` per page, visible focus, labels on every input, colour contrast ≥ 4.5:1 for body text.
- Keep the existing skip link pattern.
- Respect `prefers-reduced-motion` (disable the background crossfade and any animation).

## Performance

- Use `next/image` for CMS images with explicit sizes.
- Load Google fonts through `next/font`. Load the Adobe Fonts kit with `display=swap` and only on pages that use the key-statement font.
- Keep client components small. No client-side data fetching for CMS content.
