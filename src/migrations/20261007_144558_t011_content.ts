import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seedContent } from '../seed'

// Data migration (SPEC §6.4): creates the launch pages, news, FAQs and global values that are
// missing, and never overwrites an editor's changes.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { created } = await seedContent({ payload, req })
  payload.logger.info(`Content created: ${created.length ? created.join('; ') : 'nothing'}`)
}

// Content may have been edited since, so rolling back leaves it in place.
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('t011_content down: content left in place')
}
