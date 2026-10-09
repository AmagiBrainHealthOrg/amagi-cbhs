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

- the shared fields in SPEC §8.1, with options read live from the Airtable base (`getFormFields` in `src/lib/airtable.ts`), never the `dropdowns` global or hard-coded lists;
- hidden UTM fields: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`;
- no consent checkboxes: follow-up preferences cover how Amagi may follow up (SPEC §8.1);
- a privacy policy link next to the submit button;
- a honeypot field and a server-side rate limit;
- accessible errors (`aria-describedby`, `aria-invalid`, focus moved to the first error).

Submission order is fixed (SPEC §8.2): validate server-side → rate limit → save to `form-submissions` → send the confirmation email → redirect to the thank-you page → `syncSubmission(id)` in Next's `after()`. Never sync from an `afterChange` hook: the status update would trigger it again.

**Never collect health information.** No diagnosis, symptoms, health history or clinical fields on any form.

## Tracking

- Analytics is Plausible (SPEC §10.1). Send events only through `src/lib/tracking/`, which queues them until Plausible starts.
- Events: `form_start` (once per form per page load), `form_submit` (only after confirmed success), `donate_click`, `donation_complete` (revenue, once per Stripe session). Outbound clicks are Plausible's own.
- Data attribute names are fixed: `data-journey`, `data-action`, `data-destination-type`. Never rename them. `donate_click` listens for `data-action="donate"`.
- **No personal data** in any event or prop: no names, emails, phone numbers or free text. `donation_complete` carries amount and currency only.
- Nothing that sets cookies or browser storage for analytics, and no advertising pixels.
- Headless Chrome is ignored by Plausible: set `window.__plausible = true` before the page loads to test events.

## Stripe

- Payments happen on Stripe's hosted Checkout only. Never render card inputs or Stripe Elements on our pages.
- Confirm payment server-side (retrieve the session) before showing success or pushing `donation_complete`.
- Webhooks verify the signature with `STRIPE_WEBHOOK_SECRET` and are idempotent on the Stripe event ID.

## Environments

- Test mode is `!isLive()` (`src/utils/site.ts`, SPEC §11.1), never `NODE_ENV` or Netlify's `CONTEXT`. In test mode, form submissions are marked `isTest: true` and emails go only to `EMAIL_SANDBOX_TO`. Airtable has one base for both (SPEC §9.1): test with obvious names ("Testy Testerson") and delete the records. Stripe is outside test mode: production uses live keys from the start.
- Production runs in test mode until launch.
