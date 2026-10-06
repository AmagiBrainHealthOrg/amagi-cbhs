---
id: T013
title: Airtable sync and email adapter
milestone: M2
release: 1
depends_on: [T012, T029]
migrations: false
requires_human: true
spec: ['SPEC §8.2', 'SPEC §9.1', 'SPEC §9.2', 'SPEC §13 D7']
skills: [payload]
---

# T013: Airtable sync and email adapter

## Context

Form submissions go straight to Amagi's Airtable CRM (SPEC §9.1). Payload keeps each submission as the record and the retry queue.

Human steps: the test base exists, built from `docs/AIRTABLE.md` (T029) with a scoped personal access token. Create a Resend API key with a verified sending domain (or sandbox). Put the values in the main `.env` and tell the orchestrator.

## Scope

**In**

- `src/config/airtable.ts`: every table and field name the code uses.
- `src/lib/airtable.ts`: `upsertContact(fields)` (`performUpsert` on `Email`), `createRecord(table, fields)`, typed errors, retry with backoff on 429.
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
  - _Verify (browser + cli):_ submit `test-form` twice with the same email; reading through `src/lib/airtable.ts` shows two `test-form` records with the submitted values, UTM and `Test` ticked, both linked to one `Contacts` record; each submission's `airtable_sync_status` is `synced` with its record ID.
- [ ] **AC2**: Sync failures are recorded and retryable.
  - _Verify (db + api):_ with `AIRTABLE_BASE_ID` set to an invalid ID, a submission is saved with `airtable_sync_status = 'failed'` and an error message, the user still reaches the thank-you page, and an alert goes to `SYNC_ALERT_TO`. Restore the ID; `POST` the retry endpoint as admin; status becomes `synced`.
- [ ] **AC3**: The base check catches drift.
  - _Verify (cli):_ `pnpm airtable:check` passes against the test base; with one field name changed in `src/config/airtable.ts` it fails naming that field.
- [ ] **AC4**: Confirmation email is sent to the sandbox address.
  - _Verify (api):_ the Resend API (`GET /emails/<id>`) shows the message to `EMAIL_SANDBOX_TO` with the expected subject.
- [ ] **AC5**: Wrappers are tested.
  - _Verify (unit):_ `tests/int/airtable.int.spec.ts` (mocked `fetch`) covers contact upsert, linked record creation, 429 retry and error mapping.
- [ ] **AC6**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
