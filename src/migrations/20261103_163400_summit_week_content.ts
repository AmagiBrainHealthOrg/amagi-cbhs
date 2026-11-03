import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import type { Page, SummitWeek } from '@/payload-types'
import { hasContent } from '@/seed/hasContent'

// The week strip moves to the Summit Week Days global (3 November 2026). Its days come from the
// Summit Week page, whose copy matches the programme, with Monday as the Anchor Day; the Anchor
// Day global gets the date that highlights it. Each step runs only while its target is empty.
// A fresh database gets both from `pnpm db:seed`.
const ANCHOR_DATE = '2026-11-16T12:00:00.000Z'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('summit_week_content: fresh database, content comes from pnpm db:seed')
    return
  }

  const week = await payload.findGlobal({ slug: 'summit-week', depth: 0, req })
  if (!week.days?.length) {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'summit-week' } },
      limit: 1,
      depth: 0,
      req,
    })
    const block = ((docs[0] as Page | undefined)?.layout ?? []).find(
      (b) => b.blockType === 'summitWeek',
    )
    const days: NonNullable<SummitWeek['days']> = (
      block?.blockType === 'summitWeek' ? (block.days ?? []) : []
    ).map(({ date, label, body }) => ({
      day: `2026-11-${date.padStart(2, '0')}` as NonNullable<SummitWeek['days']>[number]['day'],
      label: date === '16' && label === 'Opening' ? 'Anchor Day' : label,
      body,
    }))
    if (days.length > 0) {
      await payload.updateGlobal({
        slug: 'summit-week',
        data: { days, _status: 'published' },
        context: { disableRevalidate: true },
        req,
      })
      payload.logger.info(`summit_week_content: ${days.length} days copied from Summit Week`)
    }
  }

  const anchorDay = await payload.findGlobal({ slug: 'anchor-day', depth: 0, req })
  if (!anchorDay.date) {
    await payload.updateGlobal({
      slug: 'anchor-day',
      data: { date: ANCHOR_DATE, _status: 'published' },
      context: { disableRevalidate: true },
      req,
    })
    payload.logger.info('summit_week_content: Anchor Day date set to Monday 16 November')
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('summit_week_content down: content left in place')
}
