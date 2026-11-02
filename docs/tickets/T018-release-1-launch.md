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

> **Launched.** Release 1 is live at amagisummit.org. The smoke test script (`scripts/smoke.ts`) was not built here; it moved to T027.

## Context

Production has been public and in test mode since T011 and T017, and editors have entered real content there, so launch is a switch, not a migration of content.

Human steps: Amagi confirms that copy is entered, reviews the draft privacy, cookies and terms copy (in place since 8 October 2026), and the data processing agreement is signed. Tandem decides D9. Then, following `docs/DEPLOY.md` (Launch, Move the projects to Amagi): transfer the Supabase project to Amagi's organisation (moving it to a paid plan for backups); make sure the Airtable token in Netlify Production can write to the base (SPEC §9.1) and delete test records from it; verify the Resend sending domain; set Integrations → Plausible domain to `amagisummit.org` and add that site in Plausible; set `SITE_LIVE=true`; point amagisummit.org at Netlify.

## Scope

**In**

- Update `docs/DEPLOY.md` with anything the move taught us, and with the D9 release process.
- If D9 is "production branch": Netlify's production branch becomes `production`, and `docs/DEPLOY.md` explains how to release by fast-forwarding it.
- Smoke test script `scripts/smoke.ts` hitting every Release 1 route, checking 200s and failing if any page contains `[PLACEHOLDER]`.

**Out**

- Release 2 work.

## Acceptance criteria

- [ ] **AC1**: Production runs on Amagi's accounts at amagisummit.org.
  - _Verify (deploy):_ `curl -I https://amagisummit.org` and `/api/health` return 200 over TLS; the user confirms the Netlify project is on Amagi's team and the Supabase project is in Amagi's organisation.
- [ ] **AC2**: Home is served at `/` to the public.
  - _Verify (deploy):_ `curl -s https://amagisummit.org | grep -c 'data-action="donate"'` ≥ 1.
- [ ] **AC3**: Smoke test passes against production.
  - _Verify (deploy):_ `pnpm tsx scripts/smoke.ts https://amagisummit.org` exits 0.
- [ ] **AC4**: A live donation flow works end to end.
  - _Verify (deploy):_ the user makes a small live donation (or Stripe live-mode test as Amagi prefers) and sees the thank-you page.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
