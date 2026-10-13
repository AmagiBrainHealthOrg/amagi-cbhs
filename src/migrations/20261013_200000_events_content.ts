import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import type { Page } from '@/payload-types'
import { eventsSection } from '@/seed/content'
import { hasContent } from '@/seed/hasContent'

// The events section below the Summit Week hero, for databases that already have content. A fresh
// database gets it from `pnpm db:seed` (SPEC §6.4). Added only while the page has none.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('events_content: fresh database, content comes from pnpm db:seed')
    return
  }
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'summit-week' } },
    limit: 1,
    depth: 0,
    req,
  })
  const page = docs[0] as Page | undefined
  const layout = page?.layout ?? []
  if (!page || layout.some((block) => block.blockType === 'events')) return

  const hero = layout.findIndex((block) => block.blockType === 'hero')
  const at = hero + 1
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: {
      layout: [...layout.slice(0, at), eventsSection, ...layout.slice(at)],
      _status: 'published',
    },
    context: { disableRevalidate: true },
    req,
  })
  payload.logger.info('events_content: events section added to Summit Week')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('events_content down: content left in place')
}
