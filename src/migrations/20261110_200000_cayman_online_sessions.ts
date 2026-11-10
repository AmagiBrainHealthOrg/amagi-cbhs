import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { hasContent } from '@/seed/hasContent'

// The Cayman Islands' online sessions, so its country page lists them with its in-person ones
// (10 November 2026). Only sessions with no country yet change, so an editor's choice is kept.
// A fresh database gets this from `pnpm db:seed`.
const slugs = [
  'cayman-islands-tech-thrive-tuesday-science-technology-and-the-future-of-brain-health',
  'cayman-brain-health-relay-allstars-netball-club',
  'cayman-brain-health-relay-the-tullet-laboratory',
  'cayman-brain-health-relay-the-ezcurra-laboratory',
  'cayman-longevity-program-morning-relay-session',
  'cayman-brain-health-relay-st-matthew-s-university-school-of-medicine',
  'cayman-brain-health-relay-netball-cayman',
  'cayman-longevity-program-afternoon-relay-session',
]

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('cayman_online_sessions: fresh database, content comes from pnpm db:seed')
    return
  }
  const { docs: countries } = await payload.find({
    collection: 'countries',
    where: { slug: { equals: 'cayman-islands' } },
    limit: 1,
    depth: 0,
    req,
  })
  const cayman = countries[0]
  if (!cayman) {
    payload.logger.info('cayman_online_sessions: no Cayman Islands country, nothing to do')
    return
  }
  const { docs } = await payload.find({
    collection: 'sessions',
    where: { and: [{ slug: { in: slugs } }, { country: { exists: false } }] },
    pagination: false,
    depth: 0,
    req,
  })
  for (const session of docs) {
    // By ID: an update by `where` collects errors instead of throwing, which hides the cause.
    await payload.update({
      collection: 'sessions',
      id: session.id,
      data: { country: cayman.id },
      context: { disableRevalidate: true },
      req,
    })
  }
  payload.logger.info(`cayman_online_sessions: ${docs.length} of ${slugs.length} sessions tagged`)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('cayman_online_sessions down: content left in place')
}
