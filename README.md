# Caribbean Brain Health Summit 2026

The public website for the Caribbean Brain Health Summit, at amagisummit.org. Next.js and Payload CMS on Supabase, hosted on Vercel. What we build is in `docs/SPEC.md`; how and in what order is in `docs/PLAN.md`.

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

   This is one way: it reads production and replaces the local `amagi_cbhs` database and bucket. Form submissions are left out. It refuses to run unless `DATABASE_URL` and `S3_ENDPOINT` point at `127.0.0.1`.

6. Start the dev server at http://localhost:3000 (admin at `/admin`):

   ```bash
   pnpm dev
   ```

## Checks

```bash
pnpm typecheck && pnpm lint && pnpm test:int && pnpm build
pnpm preflight   # the above plus stack, git, gh and migration checks
```

See `CLAUDE.md` for the full command list and the rules for working in this repo.
