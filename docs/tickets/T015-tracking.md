---
id: T015
title: Plausible events for forms, consent clean-up
milestone: M2
release: 1
depends_on: [T010, T011, T012, T030]
migrations: false
requires_human: true
spec: ['SPEC §10']
skills: []
---

# T015: Tracking

Plausible, `donate_click`, `donation_complete` and outbound clicks went live on 8 October 2026 (SPEC §10). This ticket adds the form events and removes what was left of Google Tag Manager and the cookie banner (decided 9 October 2026: the site sets no cookies for visitors, so there is nothing to consent to).

## Scope

**In**

- `src/lib/tracking/`: `trackFormStart`, `trackFormSubmit`, and the `sessionStorage` pending marker (SPEC §10.2).
- `Form`: `form_start` on the first focus, once per form per load; a valid submit sets the marker, a rejected one clears it.
- `/thank-you/[form]`: `form_submit` with `form`, `territory` and `audience_type` from the query, only when the marker is present.
- Remove the Consent Mode defaults, `dataLayer`, the cookie banner and the footer "Cookie settings" link. Hide `integrations.gtmContainerId` and the `cookie-consent` global in the admin; their columns are dropped in a later release (migrations stay backward compatible).
- `/cookies` seed copy no longer lists `cbhs_consent`.

**Out**

- Goals and custom properties in Plausible (human, see below).
- Dropping the unused columns.

## Acceptance criteria

- [ ] **AC1**: `form_start` fires once per form per load.
  - _Verify (browser):_ on `/register`, focusing two fields sends one `form_start` with `{ form: "register-interest" }` to `…/api/event`.
- [ ] **AC2**: `form_submit` fires once, only after a submit.
  - _Verify (browser):_ submitting a valid form sends one `form_submit` with `form`, `territory` and `audience_type`; reloading the thank-you page or opening `/thank-you/<key>` directly sends none.
  - _Verify (cli):_ `tests/int/tracking.int.spec.ts` passes.
- [ ] **AC3**: No personal data in events.
  - _Verify (browser):_ the `form_submit` request body contains no name, email, phone or free text.
- [ ] **AC4**: No consent or tag manager code remains.
  - _Verify (browser):_ no cookie banner, no "Cookie settings" footer link, `window.dataLayer` is undefined and no `cbhs_consent` cookie is set.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.

## Human steps

- In Plausible: goals `form_start`, `form_submit`, `donate_click`, `donation_complete` (revenue, USD); custom properties `form`, `territory`, `audience_type`, `location`.
- In the admin, edit the production `/cookies` page: remove the `cbhs_consent` entry.
