---
id: T015
title: Data layer, Google Tag Manager and events
milestone: M2
release: 1
depends_on: [T010, T011, T012, T030]
migrations: false
requires_human: false
spec: ['SPEC §10']
skills: []
---

# T015: Tracking

## Scope

**In**

- `src/lib/tracking/`: typed event helpers for every event in SPEC §10.2; a type that rejects personal-data keys (`email`, `name`, `phone`, `message`).
- Root layout: initialise `dataLayer` and push page context **before** the Google Tag Manager snippet; load the snippet only if `integrations.gtmContainerId` is set and `hasAnalyticsConsent()` (T030) is true, or as soon as the visitor accepts.
- Route-level page context (`page_type`, `audience_segment`, `journey`, `territory`) with the defaults in SPEC §10.1.
- Wire events: `form_start` (once per form per load), `form_submit` (thank-you page, once, via the `sessionStorage` marker in SPEC §10.2), `donate_click`, `donation_complete` (replace the T010 stub; once per session ID), `outbound_click` (delegated listener on external links).
- Every Button and outbound link has the three data attributes.

**Out**

- Analytics configuration (Beyond Growth).

## Acceptance criteria

- [ ] **AC1**: Page context is pushed before the tag manager loads.
  - _Verify (browser):_ on `/about`, with a test container ID set and analytics accepted, `window.dataLayer[0]` contains the four context keys, and its push happens before the GTM script element is inserted (check element order and `dataLayer` index).
- [ ] **AC2**: Events fire correctly.
  - _Verify (browser):_ focusing a form field twice yields one `form_start`; clicking Donate yields `donate_click`; completing a test donation yields `donation_complete` with `value` and `currency` only; clicking an external partner link yields `outbound_click`.
- [ ] **AC3**: Thank-you events fire once.
  - _Verify (browser):_ reloading a form thank-you page or the donation thank-you page doesn't push `form_submit` or `donation_complete` again; opening `/thank-you/<key>` directly pushes no `form_submit`.
- [ ] **AC4**: No personal data in the data layer.
  - _Verify (browser):_ after submitting a form with name and email, `JSON.stringify(window.dataLayer)` contains neither value.
- [ ] **AC5**: Every CTA carries the attributes.
  - _Verify (browser):_ on every Release 1 page, all `a.button, button.button` and external links have `data-journey`, `data-action` and `data-destination-type`.
- [ ] **AC6**: No tag manager without an ID or consent.
  - _Verify (browser):_ with `gtmContainerId` empty, or with an ID set but analytics not accepted (T030), no `googletagmanager.com` request is made; accepting loads it without a reload.
- [ ] **AC7**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
