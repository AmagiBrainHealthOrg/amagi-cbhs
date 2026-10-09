# Caribbean Brain Health Summit 2026

The public website for the Caribbean Brain Health Summit, at amagisummit.org. Next.js and Payload CMS on Supabase, hosted on Netlify. What we build is in `docs/SPEC.md`; how and in what order is in `docs/PLAN.md`.

## Local setup

1. Install [Docker](https://docs.docker.com/get-docker/) and keep it running. You also need Node 20+, pnpm and the PostgreSQL client tools (`pg_dump`, `psql`).
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the local Supabase stack (Postgres on port 54322, Storage on 54321):

   ```bash
   pnpm supabase start
   ```

4. Copy `.env.example` to `.env` and fill it in:
   - `PAYLOAD_SECRET`: any long random string.
   - `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY`: the local Storage S3 keys from `pnpm supabase status`.
   - `PULL_*`: production's database connection string and Storage S3 credentials, from the Supabase dashboard.

5. Pull production's schema, content and media into the local stack:

   ```bash
   pnpm db:pull
   ```

   This is one way: it reads production and replaces the local `amagi_cbhs` database and bucket. Form submissions are left out. It refuses to run unless `DATABASE_URL` and `S3_ENDPOINT` point at `127.0.0.1`. It finishes by running `pnpm payload migrate` on the local database, so local is production plus any migrations on your branch.

6. Start the dev server at http://localhost:3000 (admin at `/admin`):

   ```bash
   pnpm dev
   ```

## Production: mark the baseline migration as applied (one-time, before merging T003)

Production's schema was created by Payload's dev push, which leaves a `batch = -1` marker row in `payload_migrations`. From T003 on, every Vercel build runs `pnpm payload migrate` before `next build`, and every merge to `main` deploys to production, so this marker must be fixed **before the T003 pull request merges**. It's safe to run early: the code deployed now never runs migrations, and Payload never pushes schema in production.

Run this once in the Supabase SQL editor for the production project:

```sql
begin;
delete from payload_migrations where batch = -1;
insert into payload_migrations (name, batch)
  select '20261006_141524_baseline', 1
  where not exists (select 1 from payload_migrations where name = '20261006_141524_baseline');
commit;

select name, batch from payload_migrations order by id;
-- expect exactly one row: 20261006_141524_baseline | 1
```

The first deploy after the merge then applies only `20261006_141525_enable_rls`.

If the build runs before this is done:

- With the `batch = -1` row still there, `payload migrate` stops at an interactive "you've run Payload in dev mode … would you like to proceed?" prompt. A build has no one to answer it: with no input it waits indefinitely, so the build hangs until Vercel's build timeout and the deploy fails. If the prompt is cancelled instead, Payload exits with code 0, so the build carries on and deploys without applying any migration. Never answer yes: it would run the baseline over the existing tables.
- With the `batch = -1` row gone but no baseline row, `payload migrate` runs the baseline against the existing tables. Its first `CREATE TYPE` fails, the transaction rolls back, `migrate` exits 1 and the deploy fails without changing the database.

Where the deploy fails, the previous deployment keeps serving. Run the SQL above and redeploy.

Local databases pulled before the fix still carry the `batch = -1` row, so `pnpm payload migrate` (and `pnpm preflight`) stops at the same prompt. Run `pnpm db:pull` again once the SQL has run on production.

## Checks

```bash
pnpm typecheck && pnpm lint && pnpm test:int && pnpm build
pnpm preflight   # the above plus stack, git, gh and migration checks
```

See `CLAUDE.md` for the full command list and the rules for working in this repo.
