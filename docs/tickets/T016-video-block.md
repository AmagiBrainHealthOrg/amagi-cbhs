---
id: T016
title: Video block
milestone: M4
release: 2
depends_on: [T009]
migrations: true
requires_human: false
spec: ['SPEC §9.4']
skills: []
---

# T016: Video block

## Scope

**In**

- `video` block config in `src/blocks/` (YouTube or Vimeo URL, poster image), added to the `pages` layout, with a migration.
- `video` block renderer: click-to-load poster, privacy-enhanced embeds per SPEC §9.4, accessible play button with a label.

**Out**

- Substack sync (T028).

## Acceptance criteria

- [ ] **AC1**: Video loads only on click.
  - _Verify (browser):_ a page with a `video` block makes no request to YouTube or Vimeo until the play button is clicked; after clicking, the iframe `src` uses `youtube-nocookie.com` (or Vimeo with `dnt=1`).
- [ ] **AC2**: Migration applies from empty.
  - _Verify (db):_ fresh database migrates; the `video` block table exists.
- [ ] **AC3**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
