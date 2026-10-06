---
id: T022
title: Stripe webhook records donations in Airtable
milestone: M4
release: 2
depends_on: [T010, T013]
migrations: false
requires_human: true
spec: ['SPEC §7.5', 'SPEC §9.1', 'SPEC §13 D8']
skills: []
---

# T022: Donation webhook

## Context

Human steps: register the production webhook endpoint in Stripe, in test mode until launch and in live mode after it, and set `STRIPE_WEBHOOK_SECRET` in Vercel. Locally, `stripe listen` provides the secret.

## Scope

**In**

- `POST /api/stripe/webhook`: raw-body signature verification; handles `checkout.session.completed`; idempotent on event ID (store processed IDs, or upsert the `Donations` record on session ID); creates the `Donations` record per SPEC §7.5; writes the donor's name and email only if D8 says so.
- `STRIPE_WEBHOOK_SECRET` in `src/env.ts` and `.env.example`.

## Acceptance criteria

- [ ] **AC1**: Completed checkouts write one row.
  - _Verify (cli):_ `stripe listen --forward-to localhost:<port>/api/stripe/webhook` plus `stripe trigger checkout.session.completed`; the `Donations` table gains exactly one record with amount, currency and session ID.
- [ ] **AC2**: Replays don't duplicate.
  - _Verify (cli):_ `stripe events resend <evt_id>`; the record count is unchanged.
- [ ] **AC3**: Bad signatures are rejected.
  - _Verify (api):_ `curl -i -X POST /api/stripe/webhook -d '{}'` returns 400; the AC1 path still works.
- [ ] **AC4**: Donor details follow D8.
  - _Verify (code + cli):_ unless D8 says otherwise, the record has no name or email, and `grep -rn "customer_details" src` shows they aren't sent to Airtable.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
