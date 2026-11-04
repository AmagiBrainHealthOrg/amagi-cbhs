import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { hasContent } from '@/seed/hasContent'

const SLUG =
  'invited-talk-dr-ishtar-govia-ministry-of-health-wellness-national-health-research-conference'
const FROM = 'will deliver an invited online talk at'
const TO = 'will deliver an invited talk, in person and online, at'

// The talk moves from Online to Jamaica, whose times are the same, and is no longer online-only.
// Registration stays with the conference organisers. Runs only while the session is still Online
// with the original wording, so an editor's copy is kept. A fresh database gets this from
// `pnpm db:seed`.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('invited_talk_hybrid: fresh database, content comes from pnpm db:seed')
    return
  }
  const { docs: locations } = await payload.find({
    collection: 'session-locations',
    where: { name: { equals: 'Jamaica' } },
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
  if (!locations[0] || !location?.online || !session.description?.includes(FROM)) {
    payload.logger.info('invited_talk_hybrid: session already changed, left as it is')
    return
  }
  await payload.update({
    collection: 'sessions',
    id: session.id,
    data: {
      slug: SLUG,
      location: locations[0].id,
      description: session.description.replace(FROM, TO),
    },
    context: { disableRevalidate: true },
    req,
  })
  payload.logger.info('invited_talk_hybrid: session updated')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('invited_talk_hybrid down: content left in place')
}
