# CLAUDE.md

Guidance for Claude Code in this repository. Domain-specific rules live in `.claude/rules/` and load automatically when you touch matching files.

## Project overview

The public website for the **Caribbean Brain Health Summit 2026 (CBHS)**, run by Amagi Health Ltd, at amagisummit.org. The Summit runs 16–22 November 2026 across several Caribbean countries and online.

**The site's primary call to action is donating to the Summit.** Everything else (Summit information, host countries, programme, news) supports that case. Every page leads towards the Donate button.

- `docs/SPEC.md` is the source of truth for **what** we build. Read the cited section before starting work.
- `docs/PLAN.md` covers **how and in what order**, plus the definition of done.
- If code needs to diverge from the spec, update the spec in the same PR.

**Terminology:** "Call to Action" (capitalised) is the _Caribbean Call to Action on Brain Health_, a policy statement with its own page and form. For buttons, say "primary button" or "CTA button".

## Tech stack

- **Framework:** Next.js 16 (App Router, React Server Components), React 19, TypeScript 5 (strict)
- **CMS:** Payload CMS 3 (`payload`, `@payloadcms/next`, Lexical rich text, live preview)
- **Database:** Supabase Postgres via `@payloadcms/db-postgres`. Locally the Supabase CLI stack; deployed environments use the transaction pooler (SPEC §11.2)
- **Media:** Supabase Storage via `@payloadcms/storage-s3` (S3 API, client uploads)
- **Hosting:** Vercel (SPEC §11.2). No staging and no preview deployments: every merge to `main` deploys to production, which is public and stays in test mode until launch (SPEC §11.1)
- **Payments:** Stripe Checkout (hosted). No card data on our site, ever
- **Email:** Resend via Payload's email adapter
- **CRM:** Airtable via its REST API (SPEC §9.1). No Google Sheets
- **Analytics:** Plausible via `@plausible-analytics/tracker` (SPEC §10). Cookieless; on only when `integrations.plausibleDomain` is set; `integrations.plausibleHost` points it at a self-hosted Plausible. No Google Analytics
- **Testing:** Vitest (integration, `tests/int/`). No Playwright for now: browser checks use the system Chrome (`docs/tickets/INSTRUCTIONS.md` §2.3), and never run `playwright install`
- **Package manager:** pnpm

## Commands

```bash
pnpm dev                 # Dev server (localhost:3000)
pnpm build               # Production build
pnpm lint                # ESLint
pnpm typecheck           # tsc --noEmit
pnpm test:int            # Vitest
pnpm airtable:check      # Check the Airtable base still has every field the site writes
pnpm generate:types      # Regenerate src/payload-types.ts
pnpm generate:importmap  # Regenerate the admin import map
pnpm payload migrate:create --skip-empty <name>   # Schema change → migration
pnpm payload migrate                 # Apply migrations
pnpm db:seed             # Seed local content (added in T011)
pnpm preflight           # Orchestrator preflight (added in T001)

pnpm supabase start                  # Local Postgres and Storage
pnpm db:pull                         # Pull production schema and data (added in T001)
```

After any collection, global or field change:

1. `pnpm generate:types`
2. `pnpm payload migrate:create --skip-empty <name>`
3. `pnpm payload migrate`
4. `pnpm typecheck`

After adding or moving an admin component, run `pnpm generate:importmap`.

## Migrations

Vercel runs `pnpm payload migrate` before every build, so a migration reaches production when it merges to `main`. Nothing else writes to production's database from here.

**Content** goes into `src/seed/` for fresh databases (local and CI run `pnpm payload migrate`, then `pnpm db:seed`). Seeds never overwrite existing content. To bring new content to production too, write a data migration that follows `src/migrations/20261008_170000_release_1_content.ts`:

- Write it by hand and register it in `src/migrations/index.ts`. `migrate:create` waits on a prompt when the schema hasn't changed.
- Do nothing on a fresh database (no `home` page yet), so it never writes through a later config (SPEC §6.4).
- Fill only what is missing or still placeholder. Never overwrite an editor's change.
- Pass a new `context` object to every Local API call. The storage plugin sets flags on the context, and a shared object silently stops later uploads.
- Keep images in `src/seed/media/` and upload them with `filePath`, without the migration's `req`.

Test before merging:

1. Copy the local database into a scratch one: `create database amagi_cbhs_<name>`, then `pg_dump …/amagi_cbhs | psql …/amagi_cbhs_<name>`.
2. Reset the scratch copy to what production holds, then run `DATABASE_URL=…/amagi_cbhs_<name> pnpm payload migrate`.
3. Check the pages, and check `storage.objects` in the local `postgres` database for every upload.
4. On an empty database, run migrate, then `pnpm db:seed` twice. The migration should log that it skipped, and the second seed should create nothing.

## Next.js 16

This is not the Next.js in your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing framework code.

- Server Components by default. Use `"use client"` only for interactivity, browser APIs or hooks.
- Middleware is now Proxy (`src/proxy.ts`), if needed.

## Payload

Use the Payload skill at `.claude/skills/payload/` (start with `SKILL.md`). Rules are in `.claude/rules/payload.md`.

- `src/payload-types.ts` is generated. Never edit it by hand. Derive frontend types from it.
- Read content through the Payload Local API (`getPayload({ config })`) in server code. Never call the REST API from our own server components.

## Architecture

- **Content:** collections in `src/collections/`, globals in `src/globals/`, blocks in `src/blocks/`, hooks in `src/hooks/`, access helpers in `src/access/`.
- **Frontend:** routes in `src/app/(frontend)/`. Shared components in `src/components/`. Block renderers in `src/components/blocks/`.
- **External systems:** wrappers in `src/lib/` (`stripe.ts`, `airtable.ts`, `email.ts`, `substack.ts`). Plain helpers in `src/utils/`. Constants in `src/config/`.
- **Route handlers** (`src/app/(frontend)/api/` or `src/app/api/`) are thin: validate input, call `src/lib/`, respond.
- **Errors:** never swallow a failure into an empty state. Log it, and render an error state or return a non-2xx response.

## Hard rules

- **No card data on our site.** Payments only on Stripe's hosted Checkout page.
- **No personal data in tracking.** Names, emails, phone numbers and free text never go into any analytics event or prop.
- **No advertising pixels.**
- **No health questions** on any form (no diagnosis, health history or clinical data).
- **Wording:** never use "sponsor", "exhibitor" or "lead generation" in UI copy, labels or seed content.
- **Permission-gated names:** a supporter's or partner's name or logo renders only when `permissionConfirmed` is true.
- **Copy belongs in the CMS.** Never hard-code copy an editor might change. Form options come from the Airtable base (SPEC §5.3).
- **Accessibility:** WCAG 2.1 AA.
- **Secrets** live in environment variables. Never print, log or commit them.
- **Remote databases are read-only from dev machines.** `pnpm db:pull` copies production down; nothing goes up. Never run `pnpm supabase db push`, `pnpm supabase db pull`, `pnpm supabase db reset` or `pnpm supabase migration`. Payload migrations are the only schema changes, and they reach production only by merging to `main`.
- **Migrations are backward compatible.** The previous deployment runs against the new schema until the switch: add first, drop or rename in a later release.

## Code quality

- No comments unless the why is non-obvious.
- Don't abstract speculatively.
- No `any`.
- Every ticket finishes with `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` passing.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
