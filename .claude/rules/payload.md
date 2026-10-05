---
paths:
  - 'src/collections/**'
  - 'src/globals/**'
  - 'src/blocks/**'
  - 'src/hooks/**'
  - 'src/access/**'
  - 'src/payload.config.ts'
  - 'src/migrations/**'
---

# Payload Rules

Spec: `docs/SPEC.md` §5. Skill: `.claude/skills/payload/SKILL.md`.

## Schema changes

- The Postgres adapter runs with `push: false`. Every schema change ships as a migration in `src/migrations/`, created with `pnpm payload migrate:create --skip-empty <name>`.
- Migrations are backward compatible (SPEC §11.2): the previous deployment must keep working on the new schema. Add first; drop or rename in a later release.
- Never edit a migration that has merged to `main`. Write a new one.
- Migrations that change data (backfills) must be idempotent.
- Regenerate types (`pnpm generate:types`) in the same commit as the schema change.

## Access control

- Use the helpers in `src/access/`: `isAdmin`, `isAdminOrEditor`, `publishedOrAuthenticated`. Don't inline role checks.
- Roles are `admin` and `editor`, stored on `users.role` and saved to the JWT.
- `form-submissions`, `users` and the `integrations` global are admin-only.
- Public reads return only published documents (`_status: 'published'`), except for authenticated users previewing drafts.

## Drafts and preview

- The collections and globals listed in SPEC §5 use `versions.drafts` with autosave and live preview, following `src/globals/ComingSoon.ts`.
- The frontend reads drafts only when `?preview=true` and the request is authenticated.

## Hooks

- Hooks call wrappers in `src/lib/`; they contain no external API code themselves.
- `afterChange` hooks that call external systems must not throw back into the admin save. Record failures on the document (for example `sheetSyncStatus` and `sheetSyncError`) and log them.
- Revalidate affected frontend paths or tags in `afterChange` when published content changes.

## Fields

- Slugs are unique, indexed and generated from the title unless set.
- Uploads relate to `media`. Every image needs `alt`.
- Selects that hold Amagi-defined values (territories, audience types, industries) read from the `dropdowns` global at runtime; they are not hard-coded `options`.
