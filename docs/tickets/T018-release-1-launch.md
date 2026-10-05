---
id: T018
title: Release 1 launch
milestone: M3
release: 1
depends_on: [T017]
migrations: false
requires_human: true
spec: ['SPEC §11.3', 'SPEC §11.4', 'SPEC §13 D4']
skills: []
---

# T018: Release 1 launch

## Context

Human steps: Amagi confirms whether Release 1 is public (D4), that copy is entered, the data processing agreement is signed, and the production Google Tag Manager container ID is set. Then, following `docs/DEPLOY.md`: create an Amagi-owned Vercel Pro team and transfer the project; create the production Supabase project in Amagi's name with automatic RLS on; set production environment variables (transaction pooler, Stripe live keys, production spreadsheet, Resend domain); point amagisummit.org at Vercel in Cloudflare (DNS only); keep staging as a second project or environment on the Pro team.

## Scope

**In**

- Production environment per SPEC §11.1–11.2; update `docs/DEPLOY.md` with anything the move taught us.
- `/` renders the `home` page; remove `/home-preview`.
- Keep the `coming-soon` global for now (removed later).
- If D4 is "editor-only", gate the public site behind a CMS toggle (`launch` flag on `header` or a new `site` setting) showing Coming Soon to anonymous users.
- Smoke test script `scripts/smoke.ts` hitting every Release 1 route and checking 200s.

**Out**

- Release 2 work.

## Acceptance criteria

- [ ] **AC1**: Production runs on Amagi's Pro team at amagisummit.org.
  - _Verify (deploy):_ `curl -I https://amagisummit.org` and `/api/health` return 200 over TLS; the user confirms the project shows under the Amagi team.
- [ ] **AC2**: Home is served at `/` in production.
  - _Verify (deploy):_ `curl -s https://amagisummit.org | grep -c 'data-action="donate"'` ≥ 1, and the Coming Soon headline is absent (or present for anonymous users if D4 is editor-only).
- [ ] **AC3**: Smoke test passes against production.
  - _Verify (deploy):_ `pnpm tsx scripts/smoke.ts https://amagisummit.org` exits 0.
- [ ] **AC4**: A live donation flow works end to end.
  - _Verify (deploy):_ the user makes a small live donation (or Stripe live-mode test as Amagi prefers) and sees the thank-you page.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
