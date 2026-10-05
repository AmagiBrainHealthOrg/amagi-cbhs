---
id: T004
title: User roles, backfill and access helpers
milestone: M0
depends_on: [T003]
migrations: true
requires_human: false
spec: ['SPEC §5.1']
skills: [payload]
---

# T004: User roles, backfill and access helpers

## Context

Users have no roles. Adding a required role without a backfill would lock existing users out of the admin.

## Scope

**In**

- `role` field on `users`: select `admin` | `editor`, `defaultValue: 'editor'`, `required: true`, `saveToJWT: true`, editable only by admins.
- Migration that adds the column and backfills every existing user with no role to `admin` (idempotent).
- `src/access/`: `isAdmin`, `isAdminOrEditor`, `publishedOrAuthenticated`, `isAdminFieldLevel`.
- `users` collection access: admins manage all users; editors can read and update only themselves and cannot change their own role.
- Apply `isAdminOrEditor` to `media` create/update/delete; reads stay public.
- Apply admin-or-editor access to the `coming-soon` global update.

**Out**

- Access on collections that don't exist yet (each later ticket applies the helpers).

## Acceptance criteria

- [ ] **AC1**: Existing users become admins.
  - _Verify (db):_ before migrating, insert a user row without a role (on a database at the baseline); after `pnpm payload migrate`, `select email, role from users` shows `admin` for that user.
- [ ] **AC2**: New users default to editor.
  - _Verify (api):_ as an admin, `POST /api/users` without a role; the response shows `"role":"editor"`.
- [ ] **AC3**: Editors cannot escalate.
  - _Verify (api):_ as an editor, `PATCH /api/users/<self>` with `{"role":"admin"}` leaves the role as `editor`; `GET /api/users` returns only the editor's own record.
- [ ] **AC4**: Access helpers are tested.
  - _Verify (unit):_ `tests/int/access.int.spec.ts` covers each helper for admin, editor and anonymous, and passes.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
