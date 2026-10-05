---
name: pr-review
description: Review a CBHS ticket PR (or the local branch diff against main) against its ticket's acceptance criteria and the repo rules, probing every finding before reporting it.
argument-hint: '[<pr number> | local]'
allowed-tools: Bash(gh*), Bash(git*), Bash(cat*), Bash(grep*), Bash(ls*), Bash(find*), Bash(curl*), Bash(jq*), Bash(pnpm*), Bash(psql*), Bash(lsof*), Read, Grep, Glob
---

# PR Review

Review only what the diff changes; never touch unrelated code. Every finding is probed before it ships (§6). An unprobed finding is a hypothesis and goes out labelled as one.

## 1. Context

**Target.** `$ARGUMENTS` is a PR number, `local`, or empty.

- PR number: `gh pr view <n> --json number,title,url,state,headRefName,body` and `gh pr view <n> --comments`. If it doesn't resolve, stop and say so; don't review the current branch instead. If `headRefName` isn't the checked-out branch, stop and check it out first.
- `local` or empty: review the current branch against `main`. Say "branch diff, no PR" in the report header.

**Diff.** `git fetch -q origin main`, then `git diff --stat origin/main...HEAD` and `git diff origin/main...HEAD`. Classify the changed files: collection, global, block, hook, access helper, migration, route handler, page, component, test, config.

**Conventions.** Read `CLAUDE.md` and every `.claude/rules/*.md` whose `paths` match a changed file. They outrank this skill. Use the Payload skill (`.claude/skills/payload/`) for any Payload API in the diff.

**Probes use these scripts only:** `pnpm typecheck`, `pnpm lint`, `pnpm test:int`, `pnpm test:e2e`, `pnpm build`, `pnpm generate:types`, `pnpm generate:importmap`, `pnpm payload migrate`, `pnpm payload migrate:create --skip-empty <name>`.

**Environment.** Use the ticket's database and port (INSTRUCTIONS §3): `amagi_cbhs_<id>`, port `3000 + <numeric id>`. Never probe against the main checkout's database, staging or production.

## 2. Resolve the ticket

Do this before reading the diff. Take the ticket ID from the branch (`ticket/<id>-<slug>`), then read:

- `docs/tickets/<id>-*.md`: scope (in and out) and acceptance criteria.
- `docs/tickets/reports/<id>.md`: the implementer's evidence for each AC.
- Each `SPEC §x.y` the ticket cites, in `docs/SPEC.md`.

Build the **Issue Checklist** from the ACs. The PR description explains intent; where it conflicts with the ticket, the ticket defines the requirements. Anything in the diff that no AC or scope item covers is scope creep: flag it.

If the branch carries no ticket ID, say so and mark Issue Coverage unverified. Code can't evidence its own requirements.

## 3. Read every changed file twice

Once for intent, once for issues. Read the whole file, not just the hunks.

Severity:

- 🔴 **Critical**: bug, security hole, broken access control, data loss, crash, build failure, unmet AC, hard-rule breach.
- 🟡 **Warning**: anti-pattern, likely future bug, performance problem, missing error handling, convention breach.
- 🟢 **Suggestion**: readability, naming, style.

## 4. Checklist

### Acceptance criteria

- [ ] Each AC: ✅ met, ⚠️ partial or unclear, ❌ missing. Unmet AC → 🔴.
- [ ] Each AC's evidence in the report is real output from the method the AC names. PASS on unit tests alone, when the AC names `api`, `browser` or `db`, is not evidence.

### Hard rules (`CLAUDE.md`), each 🔴

- [ ] No card data or Stripe Elements; payments only via hosted Checkout.
- [ ] No personal data (names, emails, phones, free text) in `dataLayer` or any event.
- [ ] No advertising pixels.
- [ ] No health questions in any form definition.
- [ ] No "sponsor", "exhibitor" or "lead generation" in UI copy, labels or seed content.
- [ ] Supporter and partner names or logos render only when `permissionConfirmed` is true.
- [ ] No hard-coded copy an editor might change; dropdown values come from the `dropdowns` global.
- [ ] No secrets in source, logs or client bundles.

### Payload

- [ ] Every schema change ships a migration in `src/migrations/`, and `src/payload-types.ts` is regenerated in the same PR. No hand edits to generated files.
- [ ] No merged migration was edited. Data migrations are idempotent.
- [ ] Migrations are backward compatible: the previous deployment keeps working on the new schema (no drop or rename in the same release as the code change). Breaking one is 🔴.
- [ ] No `pnpm supabase db …` or `pnpm supabase migration …` commands in scripts or docs, and nothing writes to a remote database or bucket.
- [ ] Access uses the helpers in `src/access/`, not inline role checks. `form-submissions`, `users` and `integrations` stay admin-only.
- [ ] Local API calls made on behalf of a user pass `user` and `overrideAccess: false`. The default (`overrideAccess: true`) skips access control.
- [ ] Nested operations inside hooks pass `req`, so they share the transaction.
- [ ] Hooks that update the same document guard against re-triggering themselves (`context` flag).
- [ ] `afterChange` hooks calling external systems don't throw into the admin save; failures are recorded on the document and logged.
- [ ] Published content changes revalidate affected paths or tags.
- [ ] Public reads return published documents only; drafts only with `?preview=true` and an authenticated request.
- [ ] Admin components added or moved → import map regenerated.

### Next.js 16 and React

- [ ] Server Components by default; `"use client"` only for interactivity, browser APIs or hooks.
- [ ] Server code reads content through the Local API, never our own REST API.
- [ ] Framework APIs match `node_modules/next/dist/docs/`, not older Next.js (e.g. Proxy, not Middleware).
- [ ] No client-side fetching of CMS content.

### Forms, tracking and Stripe (when touched)

- [ ] Forms use the shared system: territory and audience selects, hidden UTM fields, three unticked consents, privacy link, honeypot, server-side Zod validation, rate limit, accessible errors.
- [ ] Submission order: validate → save → Airtable sync → email → redirect. Table and field names only from `src/config/airtable.ts`.
- [ ] `form_start` fires once per form per load; `form_submit` only after confirmed success; `donation_complete` carries amount and currency only.
- [ ] `data-journey`, `data-action`, `data-destination-type` on every CTA and outbound link; names unchanged.
- [ ] Stripe success confirmed server-side; webhooks verify signatures and are idempotent on event ID.

### Design system and accessibility (when touched)

- [ ] Tokens only: no raw hex outside `tokens.css`.
- [ ] Donate is the only primary button in a section.
- [ ] WCAG 2.1 AA: one `h1`, labels on inputs, visible focus, contrast, `prefers-reduced-motion` respected.
- [ ] CMS images via `next/image` with explicit sizes.

### TypeScript

- [ ] No `any`. Type assertions (`as X`) and non-null assertions (`!`) justified, or replaced with a guard.
- [ ] Types derive from `src/payload-types.ts` or `z.infer<>`, not hand-rolled shapes.
- [ ] `unknown` catch values narrowed before use.

### Correctness, errors and performance

- [ ] Edge cases: empty, null, zero, large input. Async work awaited; no floating promises where the result matters.
- [ ] Failures logged and surfaced as an error state or non-2xx response, never swallowed into an empty state.
- [ ] No query inside a loop; large collections paginated; `depth` set deliberately on Local API reads.
- [ ] No `console.log` left in, no dead code, no speculative abstraction, no fallbacks masking real errors.

### pnpm and Postgres

- [ ] `pnpm-lock.yaml` updated with any `package.json` dependency change. Never npm or yarn.
- [ ] Migrations safe on populated tables (no `NOT NULL` column without a default, no long locks), with a working `down` or explicitly one-way.
- [ ] Raw SQL, if any, is parameterised. Any interpolated SQL is 🔴.

## 5. Probe table

| Claim                          | Probe                                                                                                             |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Type error                     | `pnpm typecheck`                                                                                                  |
| Lint or convention             | `pnpm exec eslint <file>`                                                                                         |
| "X doesn't exist" / wrong path | grep the definition before claiming it                                                                            |
| Logic bug in a pure function   | run it: an existing test or `pnpm exec tsx -e` with the breaking input                                            |
| Test coverage                  | `pnpm test:int` (or the single spec); quote the decisive line                                                     |
| Access control / route handler | `curl -i` the ticket's dev server, logged in via `POST /api/users/login` with `-c/-b`; assert status and body      |
| Migration or constraint        | `pnpm payload migrate` on the ticket database, then `psql` the row that should trip it                            |
| Schema drift                   | `pnpm payload migrate:create --skip-empty drift-check` creates nothing; `pnpm generate:types` leaves no git diff  |
| Rendering or client state      | headless `@playwright/test` script against the ticket's dev server; read console errors                           |
| Build claim                    | `pnpm build`; quote the failing line                                                                              |

If the ticket's dev server isn't running, start it (`pnpm dev --port <port>` in the background) and stop only that one when done (`lsof -tiTCP:<port> -sTCP:LISTEN | xargs kill`).

## 6. Verify every finding

Label each finding before writing it up:

- **CONFIRMED**: probe output in hand.
- **REFUTED**: the probe disagreed. Delete it; don't demote it to a 🟢 or reword it as a question.
- **UNVERIFIED**: no probe can settle it (design opinion, scope creep) or the environment wasn't runnable. Ships labelled, with the reason.

A pass that probed its findings and refuted none almost certainly didn't probe them.

When fixing: capture the failing probe first, apply the fix, re-run the same probe, then run `pnpm typecheck && pnpm lint && pnpm test:int` and re-probe every other finding in the same file. If anything fails, the fix is wrong.

## 7. Output

Most severe first, not file order. Cap about 10 items per category.

```
## Code review: <PR title> (#n), or <branch> (branch diff, no PR)

### Issue coverage
Ticket: docs/tickets/<id>-<slug>.md

| AC | Status | Evidence in report |
|---|---|---|
| AC1 | ✅ / ⚠️ / ❌ | real / missing / wrong method |

### Summary
One paragraph: overall quality, biggest concerns, what's done well.
Verification: N probed, M confirmed, K refuted and dropped, J unverified.

### 🔴 Critical
1. **<short title>** (`src/path/file.ts:N`)
   Problem, why it matters, concrete fix.
   Evidence: `<command>` → `<decisive output line>`, or `UNVERIFIED: <reason>`

### 🟡 Warnings
### 🟢 Suggestions
### ✅ Working well
```

Every 🔴 and 🟡 carries an `Evidence:` line. A 🔴 that maps to an unmet AC says so.

## 8. After the review

When run by the ticket reviewer (INSTRUCTIONS §2.5), fix every in-scope 🔴 and 🟡 on the ticket branch, one at a time, following §6, then re-run `/pr-review local`. List out-of-scope findings, SPEC contradictions and anything needing a decision for the orchestrator instead of fixing them.

Run directly by a person, offer to apply the 🔴 and 🟡 fixes rather than applying them.
