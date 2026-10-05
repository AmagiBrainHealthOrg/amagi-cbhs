---
id: T017
title: Staging and production environments
milestone: M3
release: 1
depends_on: [T010, T011, T014, T015]
migrations: false
requires_human: true
spec: ['SPEC §11', 'SPEC §3.5', 'SPEC §13 D1']
skills: []
---

# T017: Staging and production environments

## Context

Human steps: decide the host (SPEC §13 D1); create accounts in Amagi's name (host, Postgres, storage, Stripe live keys, Resend domain, production spreadsheet); add Cloudflare DNS records. Provide connection details as environment variables on the host; never in the repo.

## Scope

**In**

- Deployment config for the chosen host using the existing Dockerfile (standalone output).
- Release step running `pnpm payload migrate` before the new version serves traffic.
- Staging: basic auth, `X-Robots-Tag: noindex`, Stripe test mode, `isTest` submissions, staging spreadsheet, email sandbox.
- Production: Stripe live keys, production spreadsheet, real email.
- `docs/DEPLOY.md` with the runbook: deploy, roll back, run migrations, rotate secrets.

**Out**

- Swapping `/` to Home (T018).

## Acceptance criteria

- [ ] **AC1**: Staging serves the app behind basic auth.
  - _Verify (deploy):_ `curl -i https://<staging>/about` returns 401; with credentials returns 200 and `X-Robots-Tag: noindex`.
- [ ] **AC2**: Staging is isolated.
  - _Verify (deploy):_ a staging form submission lands in the staging spreadsheet with `isTest` true; a staging donation uses Stripe test mode.
- [ ] **AC3**: Migrations run on deploy.
  - _Verify (deploy):_ deploy logs show `payload migrate` completing before the app starts.
- [ ] **AC4**: Production serves over HTTPS on amagisummit.org (Coming Soon still at `/`).
  - _Verify (deploy):_ `curl -I https://amagisummit.org` returns 200 over TLS.
- [ ] **AC5**: Gates pass.
  - _Verify (cli):_ `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exits 0.
