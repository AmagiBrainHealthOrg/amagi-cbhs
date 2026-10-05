---
id: T000
title: Short imperative title
milestone: M0
depends_on: []
migrations: false
requires_human: false
spec: ['SPEC §x.y']
skills: []
---

# T000: Short imperative title

## Context

One or two sentences on why this ticket exists. Link spec sections; don't copy them.

## Scope

**In**

- Concrete deliverables.

**Out**

- Things a reader might expect here that belong to another ticket (name it).

## Notes

Only what isn't in SPEC, PLAN, CLAUDE.md or the rules.

## Acceptance criteria

- [ ] **AC1**: Observable outcome stated as a fact.
  - _Verify (method):_ exactly what to run and what to expect.
- [ ] **ACn**: Gates and PLAN §5.3 pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
