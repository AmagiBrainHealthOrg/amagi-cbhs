import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'
import { scheduleSection, seedSessionLocations, sessionThankYou } from '@/seed/content'
import { hasContent } from '@/seed/hasContent'

// The programme (SPEC §6.3) for databases that already have content; a fresh database gets it
// from `pnpm db:seed` (SPEC §6.4). Each step fills only what is missing, so editors' changes
// are kept: locations while there are none, the schedule in place of an empty events section,
// and the session registration thank-you copy.

type Args = { payload: Payload; req: PayloadRequest }

async function locations({ payload, req }: Args) {
  const { totalDocs } = await payload.count({ collection: 'session-locations', req })
  if (totalDocs > 0) return
  for (const data of seedSessionLocations) {
    await payload.create({
      collection: 'session-locations',
      data: { ...data, _status: 'published' },
      context: { disableRevalidate: true },
      req,
    })
  }
  payload.logger.info('programme_content: session locations created')
}

async function schedule({ payload, req }: Args) {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'summit-week' } },
    limit: 1,
    depth: 0,
    req,
  })
  const page = docs[0] as Page | undefined
  const layout = page?.layout ?? []
  if (!page || layout.some((block) => block.blockType === 'schedule')) return

  const events = layout.findIndex((block) => block.blockType === 'events')
  const eventsBlock = layout[events]
  const hasEvents =
    eventsBlock?.blockType === 'events' &&
    (eventsBlock.groups ?? []).some((group) => (group.events ?? []).length > 0)
  if (hasEvents) {
    payload.logger.warn('programme_content: Summit Week has events, schedule not added')
    return
  }
  const at = events === -1 ? layout.findIndex((block) => block.blockType === 'hero') + 1 : events
  const next = [
    ...layout.slice(0, at),
    scheduleSection,
    ...layout.slice(events === -1 ? at : at + 1),
  ]
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout: next, _status: 'published' },
    context: { disableRevalidate: true },
    req,
  })
  payload.logger.info('programme_content: schedule replaces the events section on Summit Week')
}

async function thankYou({ payload, req }: Args) {
  const forms = await payload.findGlobal({ slug: 'forms', depth: 0, req })
  const entries = forms.thankYou ?? []
  if (entries.some((entry) => entry.form === sessionThankYou.form)) return
  await payload.updateGlobal({
    slug: 'forms',
    data: {
      thankYou: [...entries, { ...sessionThankYou }],
      _status: 'published',
    },
    context: { disableRevalidate: true },
    req,
  })
  payload.logger.info('programme_content: session registration thank-you copy added')
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('programme_content: fresh database, content comes from pnpm db:seed')
    return
  }
  const args = { payload, req }
  await locations(args)
  await schedule(args)
  await thankYou(args)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('programme_content down: content left in place')
}
