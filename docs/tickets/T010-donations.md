---
id: T010
title: 'Donations: amount chooser, Stripe Checkout, thank-you'
milestone: M2
release: 1
depends_on: [T006, T009]
migrations: false
requires_human: false
spec: ['SPEC §7', 'SPEC §3.1']
skills: []
---

# T010: Donations

## Scope

**In**

- `src/lib/stripe.ts` (server-only Stripe client from `STRIPE_SECRET_KEY`).
- `/donate` page: amount chooser from `donation-settings` (suggested amounts, optional custom amount with minimum), accessible radio group.
- `POST /api/donate`: Zod-validated amount; creates a Checkout Session per SPEC §7.3 with UTM and source page in `metadata`; returns a 303 redirect to the session URL.
- `/donate/thank-you`: retrieves the session, renders paid or unconfirmed states per SPEC §7.4, using copy from `donation-settings`.
- Env vars `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL` added to `src/env.ts` and `.env.example`.
- The `donationComplete` data-layer push is a placeholder call to `src/lib/tracking` (stubbed until T015).

**Out**

- Webhook and Airtable record (T022).

## Acceptance criteria

- [ ] **AC1**: Checkout sessions are created with the right amount.
  - _Verify (api):_ with Stripe test keys, `curl -i -X POST /api/donate -d amount=2500` returns 303 to `https://checkout.stripe.com/...`; the Stripe API (`stripe checkout sessions retrieve` or SDK) shows `amount_total: 2500` and the metadata.
- [ ] **AC2**: Invalid amounts are rejected.
  - _Verify (api):_ amount below `minimumAmount`, zero, negative or non-numeric returns 400; a valid amount still returns 303.
- [ ] **AC3**: Paid sessions show thank-you.
  - _Verify (browser):_ complete a test checkout with card `4242 4242 4242 4242`; `/donate/thank-you` shows the thank-you heading.
- [ ] **AC4**: Unpaid or fake sessions don't.
  - _Verify (browser):_ `/donate/thank-you?session_id=cs_test_fake` shows the unconfirmed state and no thank-you heading.
- [ ] **AC5**: No card inputs on our site.
  - _Verify (code):_ `grep -rn "@stripe/react-stripe-js\|CardElement\|PaymentElement" src` returns nothing.
- [ ] **AC6**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
