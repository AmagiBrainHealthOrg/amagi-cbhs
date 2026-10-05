---
id: T028
title: Substack posts on News
milestone: M4
release: 2
depends_on: [T011]
migrations: true
requires_human: false
spec: ['SPEC §9.3', 'SPEC §5.1', 'SPEC §5.2']
skills: [payload]
---

# T028: Substack posts on News

## Context

Moved out of Release 1. In Release 1, `/news` shows `news` items only.

## Scope

**In**

- `substack-posts` collection per SPEC §5.1: `url` unique, `approved` default `false`, admin and editor access via `src/access/` helpers.
- `substackFeedUrl` and `substackUrl` fields on the `integrations` global.
- `src/lib/substack.ts`: fetch and parse the RSS feed; upsert `substack-posts` by `url` with `approved: false` (never overwrite `approved`).
- Payload job run hourly by Vercel Cron (needs the Pro plan; Hobby runs cron at most daily), plus an admin-only "Sync now" endpoint and button.
- `/news` merges approved posts with `news` items, newest first.
- "Subscribe" link to `integrations.substackUrl`, tracked as outbound.
- Migration.

## Acceptance criteria

- [ ] **AC1**: Sync creates unapproved posts and is idempotent.
  - _Verify (unit):_ `tests/int/substack.int.spec.ts` runs the sync twice against a fixture feed; post count is unchanged on the second run, all are `approved: false`, and a manually approved post stays approved.
- [ ] **AC2**: Only approved posts appear.
  - _Verify (browser):_ approve one of two synced posts; `/news` shows only the approved one, in date order with the `news` items.
- [ ] **AC3**: Subscribe link is tracked.
  - _Verify (browser):_ the Subscribe link points to `integrations.substackUrl` and clicking it pushes `outbound_click`.
- [ ] **AC4**: Migration applies from empty.
  - _Verify (db):_ fresh database migrates; `substack_posts` exists.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
