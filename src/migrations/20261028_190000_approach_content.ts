import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import type { Page } from '@/payload-types'
import { approachSections } from '@/seed/content'
import { hasContent } from '@/seed/hasContent'

// The approach section and its two expandable sections on About, above the team, for databases
// that already have content. A fresh database gets them from `pnpm db:seed` (SPEC §6.4). Added
// only while the page has no accordion block.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('approach_content: fresh database, content comes from pnpm db:seed')
    return
  }
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'about' } },
    limit: 1,
    depth: 0,
    req,
  })
  const page = docs[0] as Page | undefined
  const layout = page?.layout ?? []
  if (!page || layout.some((block) => block.blockType === 'accordion')) return

  const team = layout.findIndex((block) => block.blockType === 'team')
  const at = team === -1 ? layout.length : team
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: {
      layout: [...layout.slice(0, at), ...approachSections, ...layout.slice(at)],
      _status: 'published',
    },
    context: { disableRevalidate: true },
    req,
  })
  payload.logger.info('approach_content: approach section added to About')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('approach_content down: content left in place')
}
