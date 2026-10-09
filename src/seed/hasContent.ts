import { type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Whether a database already has content (a Home page), for data migrations that only fill
// existing content (SPEC §6.4). Raw SQL on purpose: Payload queries select every column in the
// current config, which a fresh database doesn't have yet while older migrations run.
export async function hasContent(db: MigrateUpArgs['db']): Promise<boolean> {
  const { rows } = await db.execute(sql`select 1 from pages where slug = 'home' limit 1`)
  return rows.length > 0
}
