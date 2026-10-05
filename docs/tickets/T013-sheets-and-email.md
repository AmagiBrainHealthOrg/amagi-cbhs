---
id: T013
title: Google Sheets sync and email adapter
milestone: M2
depends_on: [T012]
migrations: false
requires_human: true
spec: ['SPEC §8.2', 'SPEC §9.1', 'SPEC §9.2']
skills: [payload]
---

# T013: Google Sheets sync and email adapter

## Context

Human steps: the user creates a Google service account and a staging spreadsheet shared with it, and a Resend API key with a verified sending domain (or sandbox). Put the values in the main `.env` and tell the orchestrator.

## Scope

**In**

- `src/lib/sheets.ts`: `appendRow(tab, row)`; creates the tab and header row if missing; typed errors.
- `afterChange` hook on `form-submissions` (create only): append to the tab named by `form`; set `sheetSyncStatus` and `sheetSyncError`; never throw into the request.
- Admin "Retry sync" action on failed submissions (custom endpoint plus a button component).
- Email adapter: `@payloadcms/email-resend`; `src/lib/email.ts` `sendConfirmation(formKey, to, data)`; templates in `src/emails/`. Outside production, send only to `EMAIL_SANDBOX_TO`.
- Form submission route sends the confirmation email after save.
- Env vars added to `src/env.ts` and `.env.example`: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, `GOOGLE_SHEETS_SPREADSHEET_ID`, `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_SANDBOX_TO`.

**Out**

- Donation rows (T022).

## Acceptance criteria

- [ ] **AC1**: Submissions reach Sheets.
  - _Verify (browser + cli):_ submit `test-form`; a script using `src/lib/sheets.ts` reads the last row of the `test-form` tab and shows the submitted values and UTM columns; the submission's `sheet_sync_status` is `synced`.
- [ ] **AC2**: Sync failures are recorded and retryable.
  - _Verify (db + api):_ with `GOOGLE_SHEETS_SPREADSHEET_ID` set to an invalid ID, a submission is saved with `sheet_sync_status = 'failed'` and an error message, and the user still reaches the thank-you page. Restore the ID; `POST` the retry endpoint as admin; status becomes `synced`.
- [ ] **AC3**: Confirmation email is sent to the sandbox address.
  - _Verify (api):_ the Resend API (`GET /emails/<id>`) shows the message to `EMAIL_SANDBOX_TO` with the expected subject.
- [ ] **AC4**: Wrappers are tested.
  - _Verify (unit):_ `tests/int/sheets.int.spec.ts` (mocked `googleapis`) covers tab creation, header row and error mapping.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
