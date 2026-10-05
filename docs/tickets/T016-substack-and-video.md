---
id: T016
title: Substack sync and video block
milestone: M2
depends_on: [T008, T009]
migrations: false
requires_human: false
spec: ['SPEC §9.3', 'SPEC §9.4']
skills: [payload]
---

# T016: Substack sync and video block

## Scope

**In**

- `src/lib/substack.ts`: fetch and parse the RSS feed; upsert `substack-posts` by `url` with `approved: false` (never overwrite `approved`).
- Payload job running hourly, plus an admin-only "Sync now" endpoint and button.
- `/news` includes approved posts (already queried in T011; confirm).
- "Subscribe" link to `integrations.substackUrl`, tracked as outbound.
- `video` block renderer: click-to-load poster, privacy-enhanced embeds per SPEC §9.4, accessible play button with a label.

**Out**

- Nothing else.

## Acceptance criteria

- [ ] **AC1**: Sync creates unapproved posts and is idempotent.
  - _Verify (unit):_ `tests/int/substack.int.spec.ts` runs the sync twice against a fixture feed; post count is unchanged on the second run, all are `approved: false`, and a manually approved post stays approved.
- [ ] **AC2**: Only approved posts appear.
  - _Verify (browser):_ approve one of two synced posts; `/news` shows only the approved one.
- [ ] **AC3**: Video loads only on click.
  - _Verify (browser):_ a page with a `video` block makes no request to YouTube or Vimeo until the play button is clicked; after clicking, the iframe `src` uses `youtube-nocookie.com` (or Vimeo with `dnt=1`).
- [ ] **AC4**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
