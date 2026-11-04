import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { hasContent } from '@/seed/hasContent'

const SLUG =
  'our-brain-our-future-different-perspectives-on-brain-health-in-suriname-and-the-caribbean'

// The Suriname event becomes hybrid: our form in person, its Zoom link online. It moves from the
// Online location, whose times are Jamaica's, to Suriname's, so 11:00–12:00 becomes 13:00–14:00.
// Runs only while the session is as the programme_sessions migration left it, so an editor's
// changes are kept. A fresh database gets this from `pnpm db:seed`.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('suriname_hybrid: fresh database, content comes from pnpm db:seed')
    return
  }
  const { docs: locations } = await payload.find({
    collection: 'session-locations',
    where: { name: { equals: 'Suriname' } },
    limit: 1,
    depth: 0,
    req,
  })
  const { docs } = await payload.find({
    collection: 'sessions',
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 1,
    req,
  })
  const session = docs[0]
  const location = typeof session?.location === 'object' ? session.location : undefined
  const untouched =
    location?.online &&
    session.startTime === '11:00' &&
    session.endTime === '12:00' &&
    session.zoomUrl &&
    !session.registrationOptions?.length
  if (!locations[0] || !untouched) {
    payload.logger.info('suriname_hybrid: session already changed, left as it is')
    return
  }
  await payload.update({
    collection: 'sessions',
    id: session.id,
    data: {
      location: locations[0].id,
      startTime: '13:00',
      endTime: '14:00',
      zoomUrl: null,
      registrationOptions: [
        { label: 'Attend in person', method: 'form' },
        { label: 'Join online', method: 'link', url: session.zoomUrl },
      ],
    },
    context: { disableRevalidate: true },
    req,
  })
  payload.logger.info('suriname_hybrid: session updated')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('suriname_hybrid down: content left in place')
}
