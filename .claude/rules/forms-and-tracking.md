---
paths:
  - 'src/components/forms/**'
  - 'src/lib/airtable.ts'
  - 'src/config/airtable.ts'
  - 'src/lib/email.ts'
  - 'src/lib/stripe.ts'
  - 'src/lib/tracking/**'
  - 'src/app/**/api/**'
  - 'src/collections/FormSubmissions.ts'
---

# Forms and Tracking Rules

Spec: `docs/SPEC.md` §7 (donations), §8 (forms), §10 (tracking).

## Forms

Every form uses the shared form system in `src/components/forms/`. Never build a one-off form.

Every form includes:

- territory and audience-type selects (and industry on organisation forms), with values from the `dropdowns` global;
- hidden UTM fields: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`;
- three separate, unticked consent checkboxes: `consentContact`, `consentPublicName`, `consentShareStory`;
- a privacy policy link next to the submit button;
- a honeypot field and a server-side rate limit;
- accessible errors (`aria-describedby`, `aria-invalid`, focus moved to the first error).

Submission order is fixed: validate server-side → save to `form-submissions` → sync to Airtable in `afterChange` → send the confirmation email → redirect to the thank-you page.

**Never collect health information.** No diagnosis, symptoms, health history or clinical fields on any form.

## Tracking

- `window.dataLayer` is initialised and page context pushed **before** the Google Tag Manager snippet loads.
- Page context keys: `page_type`, `audience_segment`, `journey`, `territory`.
- Events: `form_start` (once per form per page load), `form_submit` (only after confirmed success), `donate_click`, `donation_complete`, `outbound_click`.
- Data attribute names are fixed: `data-journey`, `data-action`, `data-destination-type`. Never rename them.
- **No personal data** in any event or data-layer value: no names, emails, phone numbers or free text. `donation_complete` carries amount and currency only.
- No advertising pixels.

## Stripe

- Payments happen on Stripe's hosted Checkout only. Never render card inputs or Stripe Elements on our pages.
- Confirm payment server-side (retrieve the session) before showing success or pushing `donation_complete`.
- Webhooks verify the signature with `STRIPE_WEBHOOK_SECRET` and are idempotent on the Stripe event ID.

## Environments

- Outside production, form submissions are marked `isTest: true`, emails go to the sandbox or a single internal address, and Airtable writes go to the staging base with `Test` ticked.
- Stripe runs in test mode everywhere except production.
