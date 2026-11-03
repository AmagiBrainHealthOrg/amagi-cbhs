import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import type { Page } from '@/payload-types'
import { hasContent } from '@/seed/hasContent'

// The Anchor Day is Monday 16 November: mark it on the Summit Week week strip, if Monday still reads "Opening".
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) return
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'summit-week' } },
    limit: 1,
    depth: 0,
    req,
  })
  const page = docs[0] as Page | undefined
  if (!page) return
  const layout = (page.layout ?? []).map((block) =>
    block.blockType !== 'summitWeek'
      ? block
      : {
          ...block,
          days: (block.days ?? []).map((day) =>
            day.date === '16' && day.label === 'Opening'
              ? { ...day, label: 'Anchor Day', anchor: true }
              : day,
          ),
        },
  )
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout, _status: 'published' },
    context: { disableRevalidate: true },
    req,
  })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('anchor_day_summit_week down: content left in place')
}
