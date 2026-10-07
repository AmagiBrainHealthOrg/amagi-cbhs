import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

// Production already ran this data migration (SPEC §6.4). It wrote through the current config,
// so on a fresh database it broke as soon as a later migration added a column to seeded content.
// Fresh databases get their content from `pnpm db:seed` instead.
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info('t011_content: content comes from pnpm db:seed')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('t011_content down: content left in place')
}
