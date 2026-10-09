---
id: T013
title: Airtable sync and email adapter
milestone: M2
release: 1
depends_on: [T012]
migrations: false
requires_human: true
spec: ['SPEC §8.2', 'SPEC §9.1', 'docs/AIRTABLE.md', 'SPEC §9.2']
skills: [payload]
---

# T013: Airtable sync and email adapter

## Context

> **Changed 9 October 2026:** the live Airtable base is the source of truth (SPEC §9.1). There is one base, no `Contacts` table and no `Test` field. The Airtable layer is already on `main`:
>
> - `src/config/airtable.ts`: form key → table and site field → Airtable field, by ID
> - `src/lib/airtable.ts`: schema, live form options (`getFormFields`), `createRecord` with 429 retry
> - `src/lib/syncSubmission.ts`: `syncSubmission(payload, id)`
> - `pnpm airtable:check`
> - `tests/int/airtable.int.spec.ts`
>
> A test record per form was written to the base on 9 October 2026. What's left is below.

Human steps: create a Resend API key with a verified sending domain (or sandbox), and put it in the main `.env`.

## Scope

**In**

- ~~The form route schedules `syncSubmission` with Next's `after()`~~ Done with the forms (T012): `submitForm` schedules it.
- On a failed sync, email `SYNC_ALERT_TO`.
- Admin "Retry sync" action on failed submissions (custom endpoint plus a button component), calling `syncSubmission`.
- Email adapter: `@payloadcms/email-resend`; `src/lib/email.ts` `sendConfirmation(formKey, to, data)`; templates in `src/emails/`. When not `isLive()`, send only to `EMAIL_SANDBOX_TO`.
- The form submission route sends the confirmation email after save.
- Env vars in `src/env.ts` and `.env.example`: `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_SANDBOX_TO`, `SYNC_ALERT_TO`. `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` are already there.

**Out**

- Donation records (T022). Airtable views and automations (Amagi).

## Acceptance criteria

- [ ] **AC1**: A submitted form reaches Airtable.
  - _Verify (browser + db + cli):_ submit a form as "Testy Testerson"; its `form-submissions` row has `airtable_sync_status = 'synced'` and a record ID, and that record in the form's table holds the submitted values and ticked consents. Delete the record afterwards.
- [ ] **AC2**: Sync failures are recorded and retryable.
  - _Verify (db + api):_ with `AIRTABLE_TOKEN` set to an invalid token, a submission is saved with `airtable_sync_status = 'failed'` and an error message, the user still reaches the thank-you page, and an alert goes to `SYNC_ALERT_TO`. Restore the token; `POST` the retry endpoint as admin; status becomes `synced`.
- [ ] **AC3**: Confirmation email is sent to the sandbox address.
  - _Verify (api):_ the Resend API (`GET /emails/<id>`) shows the message to `EMAIL_SANDBOX_TO` with the expected subject.
- [ ] **AC4**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
