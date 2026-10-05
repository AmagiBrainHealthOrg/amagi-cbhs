---
name: orchestrate
description: Run one bounded orchestrator session for the CBHS build. Merges 4 to 6 tickets through Sonnet implementers and Opus reviewers, then rewrites PROMPT.md for the next session. Runs `pnpm preflight` itself and refuses to start if it fails.
disable-model-invocation: true
---

# Orchestrator (Opus)

## Preflight and handover

The block below is produced by `pnpm preflight`, followed by `PROMPT.md` only if preflight passed.

**If the block contains `PREFLIGHT FAIL`, show it to the user and stop. Do nothing else.**

!`(pnpm -s preflight && cat PROMPT.md) || true`

## Role

You orchestrate one bounded session of the CBHS build: implementers (Sonnet) build tickets, reviewers (Opus) clear them, you merge. Preflight has verified Docker, Postgres, `gh`, a clean synced `main`, migrations and every gate. Don't re-check it.

Also read:

- @docs/tickets/README.md: the ticket index and status. It is the source of truth.
- @docs/tickets/INSTRUCTIONS.md: the implementer and reviewer protocol (§2), local environment (§3), report format (§4).
- @docs/SPEC.md and @docs/PLAN.md: don't read in full; tickets cite sections.

## Session scope

Take **4 to 6 tickets** through to merged, then wind down. In-flight tickets from `PROMPT.md` count towards the total. Stop launching once 6 have started or nothing is ready; let everything in flight finish.

## Protocol

1. **Resume.** For each in-flight ticket in `PROMPT.md`, check `gh pr view <n>` and `docs/tickets/reports/<id>.md`.
   - Report has `## Review` with ALL CLEAR: go to step 6.
   - PR open, no verdict: launch the reviewer (step 5).
   - Worktree gone, nothing committed: re-dispatch fresh.
2. **Pick work.** Tickets whose `depends_on` are all `done`. **Release 1 first** (`release: 1`, due 16 October 2026): don't start a Release 2 ticket while a Release 1 ticket is ready. Run independent tickets in parallel, each in its own worktree, about 3 implementers at a time. **Run one migration ticket at a time** (`Mig` column).
3. **Brief the implementer.** Spawn with `model: "sonnet"`, `isolation: "worktree"`. Give it:
   - the ticket path and its environment (INSTRUCTIONS §3, with id and port filled in);
   - facts it needs from its dependencies' reports (contracts, file locations, gotchas) and relevant decisions from `PROMPT.md`;
   - an instruction to follow INSTRUCTIONS §2.1–2.4;
   - the one-push rule: commit often, push once via `/pr-prep` after all gates and non-`deploy` ACs pass. Nobody polls CI.
4. **Human tickets** (`requires_human: true`): have the implementer do every repo-side step, then ask the user to do the human steps before verification continues.
5. **Launch the reviewer** when an implementer returns a PR: `model: "opus"`, no `isolation` (it works in the implementer's worktree). Brief it with the PR URL, ticket path, worktree path and environment, and an instruction to follow INSTRUCTIONS §2.5.
   - Implementer `BLOCKED` or reviewer `NOT CLEAR`: continue the relevant agent with `SendMessage`. Escalate if it doesn't converge.
6. **Merge** only on `ALL CLEAR`.
   - If `gh pr view <n> --json mergeable` is `MERGEABLE` and `main` gained only unrelated changes, squash-merge as is. Rebase only on a conflict, or when `main` gained a migration or touched the same files; then run gates locally before pushing.
   - `pnpm-lock.yaml` conflicts: `git checkout --theirs pnpm-lock.yaml && pnpm install --no-frozen-lockfile`, then confirm `pnpm install --frozen-lockfile` passes. Code conflicts go back to the reviewer.
   - Check CI once with `gh pr checks <n>`. Never merge over a failed check. Don't poll.
   - `gh pr merge <n> --squash --delete-branch` with a single-line Conventional Commit title including the ticket ID. No AI attribution.
   - **Clean up:** remove the worktree (`git worktree remove -f -f <path>`), delete the local ticket and `worktree-agent-*` branches, drop `amagi_cbhs_<id>` and `amagi_cbhs_<id>_test`.
   - Sync `main`: `git pull && pnpm install --frozen-lockfile`, plus `pnpm payload migrate` if a migration landed.
   - Tell in-flight agents (`SendMessage`) when a merge changes a contract they depend on or adds a migration.
   - After a milestone's last ticket, give the user a short summary, then continue.
7. **Shared doc edits.** Tickets that edit `docs/SPEC.md` or `CLAUDE.md` don't run in parallel with each other.
8. **Escalate** to the user, rather than guess, when a ticket is `BLOCKED`, contradicts `SPEC.md`, or needs a decision that isn't in the docs. Never stall the whole session on one ticket: park it, note it in `PROMPT.md`, move on.
9. **Interrupted agents.** Before resuming one, check its worktree still exists with commits: if so `SendMessage` it, otherwise re-dispatch fresh.

## Wind down

1. Update the status column in @docs/tickets/README.md for every ticket you touched.
2. Rewrite `PROMPT.md`, keeping its sections: **Where we are**, **Ready to start now**, **Decisions and conventions** (merge, don't append a diary), **Open questions for the user**.
3. Commit the README and `PROMPT.md` together and push. `main` must be clean and level with `origin`.
4. Reply with a short summary: merged, in flight or parked, and anything the user must decide.
