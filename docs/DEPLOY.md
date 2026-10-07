# Deploying amagisummit.org

How the site reaches production and how to change it safely. Background: SPEC §11 (environments, hosting) and §3.5 (ownership).

## Environments

- **Local:** the Supabase CLI stack. See `CLAUDE.md` and SPEC §11.5 for `pnpm db:pull`.
- **Production:** the Vercel deployment of `main`, on the one Supabase project. There is no staging and there are no preview deployments (`git.deploymentEnabled` in `vercel.json` builds `main` only).

Production is public and runs in **test mode** until launch: `SITE_LIVE` is unset, so submissions are saved with `isTest: true`, Airtable writes go to the test base, and email goes only to `EMAIL_SANDBOX_TO` (SPEC §11.1). Stripe is not in test mode: production uses live keys from the start, so donations are real before launch. Code checks this with `isLive()` from `src/utils/site.ts`, never with `NODE_ENV` or `VERCEL_ENV`.

## Deploy

1. Verify the change locally, including any migration (`pnpm payload migrate` against your local database).
2. Open a PR against `main`. Gates: `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build`.
3. Merge. Vercel builds `main` with `pnpm payload migrate && pnpm build` (`buildCommand` in `vercel.json`), so migrations run before the new code is built. The previous deployment keeps serving until the new one is ready.
4. Check production:

   ```bash
   curl -i https://<production>/api/health   # 200 {"status":"ok"}; 503 means the database is unreachable
   curl -i https://<production>/
   ```

A failed build leaves the previous deployment serving. Fix forward with a new PR.

## Roll back

Use Vercel **Instant Rollback** (project → Deployments → the deployment → Instant Rollback). It switches traffic to an earlier build; it does **not** undo migrations.

Only roll back to a deployment whose code works with the **current** schema. Because migrations are backward compatible (add first, drop or rename in a later release), the deployment immediately before a migration is normally safe. Never roll back past a release that dropped or renamed something the older code still reads.

After rolling back, fix forward on `main`. The next merge deploys normally and takes traffic again.

## Migrations

- Payload migrations are the only schema changes. Never change the schema in the Supabase dashboard, and never run `pnpm supabase db push`, `db pull`, `db reset` or `migration`.
- After a collection, global or field change: `pnpm generate:types`, `pnpm payload migrate:create --skip-empty <name>`, `pnpm payload migrate`, `pnpm typecheck`.
- Every migration must work with both the previous and the new code (SPEC §11.2): add a column or table in one release, stop using the old one, then drop it in a later release.
- Migrations reach production only by merging to `main`.
- New tables get RLS automatically (Supabase automatic RLS). Payload connects as the table owner, so it isn't affected.

## Rotate a secret

Secrets live only in Vercel environment variables (Production) and each developer's local `.env`. Never commit them.

1. Create the new value at the provider (Supabase database password or S3 key, Stripe key, Resend key, Airtable token, or a new random `PAYLOAD_SECRET`).
2. Update it in Vercel → Project → Settings → Environment Variables → Production.
3. Redeploy: Deployments → latest production deployment → Redeploy. Environment changes apply only to new deployments.
4. Check `/api/health` and the affected feature, then revoke the old value at the provider.

Changing `PAYLOAD_SECRET` signs every editor out. Changing the database password means updating `DATABASE_URL` (transaction pooler, port 6543) in the same step.

## Launch (T018)

1. Point Airtable at the production base: set its token and base ID in Vercel Production.
2. Set `SITE_LIVE=true` in Vercel Production. Any other value, or unset, keeps test mode.
3. Redeploy, then check `/` and `/api/health`.

## Move the projects to Amagi (T018)

Until launch the Vercel project is on Tandem's Hobby team and the Supabase project may sit in Tandem's organisation (SPEC §3.5).

**Vercel**

1. Amagi creates a Pro team and invites a Tandem member.
2. Tandem transfers the project: Project → Settings → General → Transfer Project, to the Amagi team.
3. Check that the environment variables, the production branch (`main`), the Git connection and the domains came across, then redeploy and check `/api/health`.

**Supabase**

1. Amagi creates an organisation on a paid plan (for backups) and invites a Tandem member.
2. Tandem transfers the project: Project Settings → General → Transfer project.
3. Connection strings and keys don't change on transfer. Check `/api/health` afterwards, and confirm automatic RLS is still on.

## One-off settings (not in the repo)

- **Vercel:** production branch is `main`; `SITE_LIVE` is unset for Production until launch.
- **Supabase:** automatic RLS for new tables is on.
