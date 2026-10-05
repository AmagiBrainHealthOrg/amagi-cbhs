---
description: Push the current ticket branch and open its PR against main
allowed-tools: Bash(git*), Bash(gh*), Bash(cat*), Bash(ls*)
---

Open a pull request for the current branch against `main`. This is the implementer's only push (INSTRUCTIONS §2.4).

## Gather first

Run these; don't guess:

- `git branch --show-current`: must be `ticket/<id>-<slug>`. Stop if it isn't.
- `git log --oneline main..HEAD`
- `git diff --stat main...HEAD`
- `cat docs/tickets/<id>-*.md` and `cat docs/tickets/reports/<id>.md`
- `gh pr list --head <branch> --json number,url`: if a PR exists, update its body with `gh pr edit` instead of creating another.

## Push and open

1. `git push -u origin <branch>`
2. Write the body to a temp file, then `gh pr create --base main --head <branch> --title "<title>" --body-file <tmp>`.

Title: Conventional Commit with the ticket ID, e.g. `feat(forms): shared form system (T012)`.

## Body

Plain `##` headings and plain bullets. No prose paragraphs, bold or emphasis.

- `## What`: 1–2 lines on what the PR does and why. If that takes more than 2 lines, the PR carries too many concerns; say so and stop.
- `## Changes`: bullets on what changed and why. One subheading per concern if there are several.
- `## Ticket`: `docs/tickets/<id>-<slug>.md`, report at `docs/tickets/reports/<id>.md`.
- `## Notes`: only for a real caveat (deferred work, follow-ups, SPEC edits). Omit the heading otherwise.

Describe impact, not mechanism: the reviewer has the diff. Say "auth check runs before the DB write", not "moved the check to line 40". Base every bullet on the commits and diffstat you read. No filler, no hedging.

Report the PR URL when done.

## Never

- "Generated with Claude Code", "Co-Authored-By: Claude" or any other AI attribution.
- Push again after this. Fixes from review are pushed once by the reviewer.
