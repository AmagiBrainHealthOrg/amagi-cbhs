import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import type { Page } from '@/payload-types'
import { hasContent } from '@/seed/hasContent'

// Moves About's team section from before the donate banner (where team_content put it) to just
// after "Why a Summit". A section an editor has already moved is left where it is.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) return

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'about' } },
    limit: 1,
    depth: 0,
    req,
  })
  const about = docs[0] as Page | undefined
  const layout = about?.layout ?? []
  const team = layout.findIndex((block) => block.blockType === 'team')
  const banner = layout.findIndex((block) => block.blockType === 'donateBanner')
  const why = layout.findIndex(
    (block) => block.blockType === 'richText' && block.heading === 'Why a Summit',
  )
  if (!about || team < 0 || why < 0 || team !== banner - 1 || team === why + 1) {
    payload.logger.info('team_position: nothing to move')
    return
  }

  const rest = layout.filter((_, index) => index !== team)
  const after = rest.indexOf(layout[why]) + 1
  await payload.update({
    collection: 'pages',
    id: about.id,
    data: { layout: [...rest.slice(0, after), layout[team], ...rest.slice(after)] },
    context: { disableRevalidate: true },
    req,
  })
  payload.logger.info('team_position: team section moved below "Why a Summit"')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('team_position down: layout left in place')
}
