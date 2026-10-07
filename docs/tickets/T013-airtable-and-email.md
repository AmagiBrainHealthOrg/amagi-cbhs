---
id: T013
title: Airtable sync and email adapter
milestone: M2
release: 1
depends_on: [T012, T029]
migrations: false
requires_human: true
spec: ['SPEC §8.2', 'SPEC §9.1', 'docs/AIRTABLE.md', 'SPEC §9.2', 'SPEC §13 D7']
skills: [payload]
---

# T013: Airtable sync and email adapter

## Context

Form submissions go straight to Amagi's Airtable CRM (SPEC §9.1). Payload keeps each submission as the record and the retry queue.

Human steps: the test base exists, built from `docs/AIRTABLE.md` (T029) with a scoped personal access token. Create a Resend API key with a verified sending domain (or sandbox). Put the values in the main `.env` and tell the orchestrator.

## Scope

**In**

- `src/config/airtable.ts`: every table and field name the code uses, exactly as in `docs/AIRTABLE.md`, plus the form key → table map (`register-interest` → `Register Interest`, `cta-consultation` → `Call to Action Consultation`, `partner` → `Partner Sign-Ups`, `relay` → `Relay`, `contact` → `Contact Enquiries`).
- `src/lib/airtable.ts`: `upsertContact(fields)` (`performUpsert` on `Email`), `createRecord(table, fields)`, typed errors, retry with backoff on 429. Every write sends `typecast: true`, so a dropdown value the base doesn't have yet becomes a new single-select option instead of failing the sync (`docs/AIRTABLE.md`, "Rules for the base").
- Field values per `docs/AIRTABLE.md`: emails lower-cased; single selects get the stored dropdown `value` (for example `country_lead`), and `Area of interest` gets the action area title; dates and times as ISO 8601 in UTC; `Relay`'s `Activity date` as a date only.
- `Contacts` keeps first-touch data: `First UTM …` and `First seen` are written only when the contact is new. `performUpsert` overwrites every field it's sent, so look the contact up by email first and leave those fields out for an existing contact. Classification, consents, `Latest UTM …` and `Last seen` always take the latest values. `Phone` takes the latest value given; leave it out when the form's phone is blank so an earlier number isn't cleared.
- `pnpm airtable:check`: reads the base schema and fails, naming each missing table or field.
- `syncSubmission(id)` per SPEC §8.2: upsert the contact, create the form's record linked to it, set `Test` when not `isLive()` (SPEC §11.1); set `airtableSyncStatus`, `airtableSyncError` and `airtableRecordId`. The form route schedules it with Next's `after()`; there is no `afterChange` hook, so the status update can't trigger another sync. On failure, email `SYNC_ALERT_TO`.
- Admin "Retry sync" action on failed submissions (custom endpoint plus a button component), calling `syncSubmission`.
- Email adapter: `@payloadcms/email-resend`; `src/lib/email.ts` `sendConfirmation(formKey, to, data)`; templates in `src/emails/`. When not `isLive()`, send only to `EMAIL_SANDBOX_TO`.
- Form submission route sends the confirmation email after save.
- Env vars added to `src/env.ts` and `.env.example`: `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_SANDBOX_TO`, `SYNC_ALERT_TO`.

**Out**

- Donation records (T022). Airtable views and automations (Amagi).

## Acceptance criteria

- [ ] **AC1**: Submissions reach Airtable, linked to a contact.
  - _Verify (api + cli):_ create two `register-interest` submissions with the same email (mixed case) and different UTM, through the Local API since T014 builds the form, and run `syncSubmission` for each; reading through `src/lib/airtable.ts` shows two `Register Interest` records with the submitted values, UTM, `Source page`, `Submitted at` and `Test` ticked, both linked to one `Contacts` record whose `Email` is lower case, whose `First UTM …` and `First seen` come from the first submission and whose `Latest UTM …` and `Last seen` come from the second; each submission's `airtable_sync_status` is `synced` with its record ID.
- [ ] **AC1b**: A new dropdown value doesn't break the sync.
  - _Verify (api + cli):_ a submission whose `territory` is a value the base's `Territory` field doesn't have yet syncs, and the field now has that option.
- [ ] **AC2**: Sync failures are recorded and retryable.
  - _Verify (db + api):_ with `AIRTABLE_BASE_ID` set to an invalid ID, a submission is saved with `airtable_sync_status = 'failed'` and an error message, the user still reaches the thank-you page, and an alert goes to `SYNC_ALERT_TO`. Restore the ID; `POST` the retry endpoint as admin; status becomes `synced`.
- [ ] **AC3**: The base check catches drift.
  - _Verify (cli):_ `pnpm airtable:check` passes against the test base; with one field name changed in `src/config/airtable.ts` it fails naming that field.
- [ ] **AC4**: Confirmation email is sent to the sandbox address.
  - _Verify (api):_ the Resend API (`GET /emails/<id>`) shows the message to `EMAIL_SANDBOX_TO` with the expected subject.
- [ ] **AC5**: Wrappers are tested.
  - _Verify (unit):_ `tests/int/airtable.int.spec.ts` (mocked `fetch`) covers contact upsert (first-touch fields only for a new contact), linked record creation, `typecast: true` on every write, 429 retry and error mapping.
- [ ] **AC6**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
