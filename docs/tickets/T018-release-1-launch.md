---
id: T018
title: Release 1 launch
milestone: M3
release: 1
depends_on: [T010, T011, T014, T015, T017]
migrations: false
requires_human: true
spec: ['SPEC §11.1', 'SPEC §11.3', 'SPEC §3.5', 'SPEC §13 D9']
skills: []
---

# T018: Release 1 launch

## Context

Production has been public and in test mode since T011 and T017, and editors have entered real content there, so launch is a switch, not a migration of content.

Human steps: Amagi confirms that copy is entered, reviews the draft privacy, cookies and terms copy (in place since 8 October 2026), the data processing agreement is signed, and the Google Tag Manager container ID is set. Tandem decides D9. Then, following `docs/DEPLOY.md`: create an Amagi-owned Vercel Pro team and transfer the project; transfer the Supabase project to Amagi's organisation (moving it to a paid plan for backups); make sure the Airtable token in Vercel Production can write to the base (SPEC §9.1) and delete test records from it; verify the Resend sending domain in Cloudflare; set `SITE_LIVE=true`; point amagisummit.org at Vercel in Cloudflare (DNS only).

## Scope

**In**

- Update `docs/DEPLOY.md` with anything the move taught us, and with the D9 release process.
- If D9 is "production branch": Vercel's production branch becomes `production`, and `docs/DEPLOY.md` explains how to release by fast-forwarding it.
- Smoke test script `scripts/smoke.ts` hitting every Release 1 route, checking 200s and failing if any page contains `[PLACEHOLDER]`.

**Out**

- Release 2 work.

## Acceptance criteria

- [ ] **AC1**: Production runs on Amagi's accounts at amagisummit.org.
  - _Verify (deploy):_ `curl -I https://amagisummit.org` and `/api/health` return 200 over TLS; the user confirms the Vercel project shows under the Amagi team and the Supabase project under Amagi's organisation.
- [ ] **AC2**: Home is served at `/` to the public.
  - _Verify (deploy):_ `curl -s https://amagisummit.org | grep -c 'data-action="donate"'` ≥ 1.
- [ ] **AC3**: Smoke test passes against production.
  - _Verify (deploy):_ `pnpm tsx scripts/smoke.ts https://amagisummit.org` exits 0.
- [ ] **AC4**: A live donation flow works end to end.
  - _Verify (deploy):_ the user makes a small live donation (or Stripe live-mode test as Amagi prefers) and sees the thank-you page.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
