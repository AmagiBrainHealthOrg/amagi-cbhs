import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seedProgrammeLocations } from '@/seed/content'
import { hasContent } from '@/seed/hasContent'
import { seedProgramme } from '@/seed/seedProgramme'

// The CBHS 2026 programme (src/seed/programme.ts) for databases that already have content; a
// fresh database gets it from `pnpm db:seed` (SPEC §6.4). Adds the United States location,
// themes and sessions that are missing, and never changes an existing one.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('programme_sessions: fresh database, content comes from pnpm db:seed')
    return
  }
  for (const data of seedProgrammeLocations) {
    const { totalDocs } = await payload.count({
      collection: 'session-locations',
      where: { name: { equals: data.name } },
      req,
    })
    if (totalDocs > 0) continue
    await payload.create({
      collection: 'session-locations',
      data: { ...data, _status: 'published' },
      context: { disableRevalidate: true },
      req,
    })
    payload.logger.info(`programme_sessions: location ${data.name} created`)
  }
  const created = await seedProgramme({ payload, req })
  payload.logger.info(`programme_sessions: created ${created.length} themes and sessions`)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('programme_sessions down: content left in place')
}
