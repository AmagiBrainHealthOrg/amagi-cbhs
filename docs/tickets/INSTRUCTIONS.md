# Ticket Execution Instructions

For the **Sonnet implementers** and **Opus reviewers**. The orchestrator protocol is in `.claude/skills/orchestrate/SKILL.md`. What to build and how the code should look lives in:

- `docs/SPEC.md` (tickets cite `SPEC §x.y`)
- `docs/PLAN.md` (definition of done: `PLAN §5.3`)
- `CLAUDE.md` and `.claude/rules/*.md` (load automatically)
- `.claude/skills/payload/`

Don't restate those documents in reports or comments. Follow them.

## 1. Orchestrator

Run `/orchestrate`. Everything below is for implementers and reviewers.

## 2. Implementer (Sonnet) and reviewer (Opus)

### 2.1 Before coding

- Read the whole ticket, then every SPEC section it cites. Read `node_modules/next/dist/docs/` for any Next.js API you touch, and the Payload skill for any Payload API.
- Invoke the skills in the ticket's `skills` frontmatter.
- Read 2–3 existing files of the same kind before creating a new one, and match them.
- Work only on `ticket/<id>-<slug>`. Rename the branch if the worktree starts on `worktree-agent-*`.
- Stay within **In scope**. If something out of scope is needed, stop and report it.

### 2.2 Implementation loop

```
implement → gates → verify every AC → all PASS? → report
                          ↑                │ no
                          └── fix ← diagnose
```

1. Implement the scope.
2. Gates, all green before AC verification:

   ```bash
   pnpm typecheck && pnpm lint && pnpm test:int && pnpm build
   ```

3. Verify each AC by its stated method (§2.3), capturing evidence.
4. On any failure: diagnose the root cause, fix, re-run gates, then re-verify **every** AC. Never weaken an AC, test or assertion to pass.
5. After 5 full verify cycles with any AC still failing, stop and report `BLOCKED` with your diagnosis.

### 2.3 Verification methods

| Method    | How                                                                                                                          | Evidence                                               |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `db`      | `psql "$DATABASE_URL" -c "…"`. Use `BEGIN; … ROLLBACK;` for negative tests                                                   | SQL and output                                         |
| `api`     | Run the dev server (§3) and `curl -i`. For Payload REST, log in via `POST /api/users/login` and keep the cookie with `-c/-b` | Command, status line, relevant body                    |
| `browser` | Isolated headless `@playwright/test` script against your dev server. Screenshots in `.verification/<id>/`                    | Screenshot paths, console errors (none unless allowed) |
| `unit`    | Vitest. The named test must exist and pass                                                                                   | Test names and pass output                             |
| `cli`     | Run the named command                                                                                                        | Command, output, exit code                             |
| `code`    | `grep` or reading files, for structural rules                                                                                | Command and output                                     |
| `deploy`  | Against staging or production URL with `curl -i` or a headless browser                                                       | Command, output, URL                                   |

Rules:

- **Visual ACs:** screenshots at 1280px and 390px.
- **Negative ACs:** prove the failure happens _and_ the valid path still works.
- **Server logs:** check dev server output for errors before reporting.
- **External services:** use test modes and fixtures (Stripe test keys, Resend sandbox, staging spreadsheet). Never hit production services.

### 2.4 Finish

1. Delete temporary routes and stop your dev server.
2. Write `docs/tickets/reports/<id>.md` (§4) and commit it.
3. Conventional Commit with the ticket ID. No AI attribution.
4. Rebase onto `main`, then open the PR with `/pr-prep` (or, if you can't invoke it, read `.claude/commands/pr-prep.md` and follow it). Never merge.
   - **Push once**, after every gate and non-`deploy` AC passes locally. Commit locally as often as you like.
   - Don't wait for or poll CI.
5. Return the PR URL and the report's summary table to the orchestrator.

### 2.5 Reviewer (Opus)

Work in the implementer's worktree, on its branch, with its database and port.

1. Run `/pr-review <n>` on the PR. Reject any AC without reproducible evidence, or marked PASS on unit tests alone when it names another method.
2. Fix every finding on the ticket branch. Findings that are out of scope, contradict SPEC or need a decision: list them for the orchestrator instead. After fixing, run gates and re-verify every AC the fixes touched plus at least one other.
3. Repeat `/pr-review local` on the local diff against `main` until no findings, max 3 rounds. Don't push between rounds.
4. Append `## Review` to the report, commit, push **once**, and return `ALL CLEAR` or `NOT CLEAR` (with open findings).

## 3. Local environment

One Postgres container from `docker-compose.yml` (service `postgres`, user `postgres`, password `postgres`). Each ticket gets its own database and port so implementers can run in parallel.

| Item                   | Value                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Database               | `amagi_cbhs_<id>`, e.g. `amagi_cbhs_t012`                                           |
| `DATABASE_URL`         | `postgres://postgres:postgres@localhost:5432/amagi_cbhs_<id>`                       |
| Dev server port        | `3000 + <numeric id>`, e.g. T012 → 3012. `pnpm dev --port <port>` in the background |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:<port>`                                                           |
| Artefacts              | `.verification/<id>/` (git-ignored)                                                 |

Setup in the worktree:

1. `pnpm install`
2. `psql postgres://postgres:postgres@localhost:5432/postgres -c "create database amagi_cbhs_<id>"`
3. `cp <main checkout>/.env .env`, then set `DATABASE_URL` and `NEXT_PUBLIC_SITE_URL` for your id and port. Check with `grep -c amagi_cbhs_<id> .env` (must print 1).
4. `pnpm payload migrate` (and `pnpm db:seed` once it exists).

Rules:

- Never print `.env` or any secret. Never modify the main checkout's `.env`.
- Never stop or recreate the Postgres container. If it's down, `docker compose up -d postgres` from the repo root.
- Kill only your own dev server: `lsof -tiTCP:<port> -sTCP:LISTEN | xargs kill`.
- Test users: create via `POST /api/users/first-register` on an empty database, or `payload.create({ collection: 'users', ... })` in a test, with emails `<id>-<n>@test.local`.

## 4. Report format

`docs/tickets/reports/<id>.md`:

```markdown
# <id> report: <title>

Status: DONE | BLOCKED
Branch: ticket/<id>-<slug>
Verify cycles: <n>

## Summary table

| AC  | Result | Method | Evidence      |
| --- | ------ | ------ | ------------- |
| AC1 | PASS   | db     | see AC1 below |

## Gates

typecheck ✔ · lint ✔ · test:int ✔ (N passed) · build ✔

## Evidence

### AC1

<command>
<trimmed output>

## Deviations and follow-ups

- Out-of-scope findings, SPEC ambiguities, any SPEC.md edits (cite the section).

## Review

Verdict: ALL CLEAR | NOT CLEAR
PR: #<n>
Rounds: <n>

| Finding | Severity | Resolution |
| ------- | -------- | ---------- |

Re-verified: AC<n> (<method>) PASS · gates ✔
```

Evidence must be real output, trimmed to the decisive lines.

## 5. Ticket format

See `_TEMPLATE.md`. Frontmatter keys: `id`, `title`, `milestone`, `depends_on`, `migrations`, `requires_human`, `spec`, `skills`.
