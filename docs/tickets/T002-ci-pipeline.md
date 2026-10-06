---
id: T002
title: GitHub Actions CI
milestone: M0
release: 1
depends_on: [T001]
migrations: false
requires_human: false
spec: []
skills: []
---

# T002: GitHub Actions CI

## Scope

**In**

- `.github/workflows/ci.yml`: on pull requests and pushes to `main`, with no path filters (a required check that skips docs-only PRs would block them from merging). Postgres 17 service; `pnpm install --frozen-lockfile`; `pnpm typecheck`; `pnpm lint`; `pnpm payload migrate`; `pnpm test:int`; `pnpm build`. Dummy env values for build-time validation. Concurrency group cancelling superseded runs.

**Out**

- End-to-end tests in CI (T026).

## Acceptance criteria

- [ ] **AC1**: The workflow is valid and runs every gate.
  - _Verify (code):_ the workflow contains steps for typecheck, lint, migrate, test:int and build, in that order.
- [ ] **AC2**: CI passes on this ticket's PR.
  - _Verify (deploy):_ `gh pr checks <n>` shows the CI job passed (checked once after push).
- [ ] **AC3**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
