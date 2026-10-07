---
id: T030
title: Cookie consent banner
milestone: M2
release: 1
depends_on: [T006, T009]
migrations: false
requires_human: false
spec: ['SPEC §10.5', 'SPEC §4.1', 'SPEC §5.2']
skills: []
---

# T030: Cookie consent banner

## Context

Analytics cookies need consent before they're set (SPEC §10.5). Google Tag Manager (T015) loads only through the consent state this ticket provides.

## Scope

**In**

- `src/lib/consent.ts`: read and write the `cbhs_consent` cookie (`analytics` | `rejected`, 6 months, `SameSite=Lax`, `Secure`); `hasAnalyticsConsent()`; an event that T015 listens to so Google Tag Manager can load as soon as the visitor accepts.
- Consent Mode defaults pushed to `dataLayer` before anything else (every type `denied`); accepting updates `analytics_storage` to `granted`. Advertising types are never granted.
- Banner component in the root layout, using copy from the `cookie-consent` global: Accept and Reject equally prominent, a link to `/cookies`, no modal or focus trap, never covering the header's Donate button.
- "Cookie settings" link in the footer that reopens the banner. Rejecting after accepting deletes `_ga*` cookies on our domain.

**Out**

- Loading Google Tag Manager and events (T015). Cookie page copy (Amagi, via the CMS).

## Acceptance criteria

- [ ] **AC1**: No consent, no analytics.
  - _Verify (browser):_ on a first visit with a test `gtmContainerId` set (and T015 merged, otherwise check the consent state only), no request goes to `googletagmanager.com` and `document.cookie` has no `_ga` cookie; after Reject, the same holds on the next page.
- [ ] **AC2**: Accept grants analytics only.
  - _Verify (browser):_ after Accept, `cbhs_consent=analytics` is set, `dataLayer` contains a consent update granting `analytics_storage`, and `ad_storage` is still `denied`.
- [ ] **AC3**: The choice can be changed.
  - _Verify (browser):_ the footer's "Cookie settings" reopens the banner; Reject after Accept sets `cbhs_consent=rejected` and removes `_ga*` cookies.
- [ ] **AC4**: The banner is accessible.
  - _Verify (browser):_ keyboard-only, both buttons can be reached and used; focus is not trapped; a Lighthouse accessibility audit (system Chrome) with the banner open reports no failing audits. Screenshots at 390px and 1280px.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
