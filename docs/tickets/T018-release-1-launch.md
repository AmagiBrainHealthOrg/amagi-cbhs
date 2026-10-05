---
id: T018
title: Release 1 launch
milestone: M3
depends_on: [T017]
migrations: false
requires_human: true
spec: ['SPEC §11.3', 'SPEC §11.4', 'SPEC §14 D4']
skills: []
---

# T018: Release 1 launch

## Context

Human steps: Amagi confirms whether Release 1 is public (D4), that copy is entered, the data processing agreement is signed, and the production Google Tag Manager container ID is set.

## Scope

**In**

- `/` renders the `home` page; remove `/home-preview`.
- Keep the `coming-soon` global for now (removed later).
- If D4 is "editor-only", gate the public site behind a CMS toggle (`launch` flag on `header` or a new `site` setting) showing Coming Soon to anonymous users.
- Smoke test script `scripts/smoke.ts` hitting every Release 1 route and checking 200s.

**Out**

- Release 2 work.

## Acceptance criteria

- [ ] **AC1**: Home is served at `/` in production.
  - _Verify (deploy):_ `curl -s https://amagisummit.org | grep -c 'data-action="donate"'` ≥ 1, and the Coming Soon headline is absent (or present for anonymous users if D4 is editor-only).
- [ ] **AC2**: Smoke test passes against production.
  - _Verify (deploy):_ `pnpm tsx scripts/smoke.ts https://amagisummit.org` exits 0.
- [ ] **AC3**: A live donation flow works end to end.
  - _Verify (deploy):_ the user makes a small live donation (or Stripe live-mode test as Amagi prefers) and sees the thank-you page.
- [ ] **AC4**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
