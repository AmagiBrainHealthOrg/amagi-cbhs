---
id: T022
title: Stripe webhook writes donations to Sheets
milestone: M4
release: 2
depends_on: [T010, T013]
migrations: false
requires_human: true
spec: ['SPEC §7.5']
skills: []
---

# T022: Donation webhook

## Context

Human steps: register the webhook endpoint in Stripe (staging and production) and set `STRIPE_WEBHOOK_SECRET` on each host.

## Scope

**In**

- `POST /api/stripe/webhook`: raw-body signature verification; handles `checkout.session.completed`; idempotent on event ID (store processed IDs, or check the Sheets row by session ID); appends to the `Donations` tab per SPEC §7.5; never writes the customer's email or name.
- `STRIPE_WEBHOOK_SECRET` in `src/env.ts` and `.env.example`.

## Acceptance criteria

- [ ] **AC1**: Completed checkouts write one row.
  - _Verify (cli):_ `stripe listen --forward-to localhost:<port>/api/stripe/webhook` plus `stripe trigger checkout.session.completed`; the `Donations` tab gains exactly one row with amount, currency and session ID.
- [ ] **AC2**: Replays don't duplicate.
  - _Verify (cli):_ `stripe events resend <evt_id>`; the row count is unchanged.
- [ ] **AC3**: Bad signatures are rejected.
  - _Verify (api):_ `curl -i -X POST /api/stripe/webhook -d '{}'` returns 400; the AC1 path still works.
- [ ] **AC4**: No personal data written.
  - _Verify (code + cli):_ the row has no email or name column; `grep -n "customer_details" src/app` shows it isn't written.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
