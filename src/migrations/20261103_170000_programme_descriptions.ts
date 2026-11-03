import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { hasContent } from '@/seed/hasContent'

// Drops the "Description TBC." placeholders from 16 programme sessions. Each description changes
// only while it is still the text the programme_sessions migration wrote, so an editor's copy is
// kept. A fresh database gets the new text from `pnpm db:seed`.
const changes: { slug: string; from: string; to: string }[] = [
  {
    slug: 'barbados-alzheimer-s-association-brain-health-relay',
    from: 'Barbados Brain Health Relay contribution. Description TBC.',
    to: 'Barbados Brain Health Relay contribution.',
  },
  {
    slug: 'barbados-council-for-the-disabled-brain-health-relay',
    from: 'Barbados Brain Health Relay contribution; participation TBC. Description TBC.',
    to: 'Barbados Brain Health Relay contribution.',
  },
  {
    slug: 'cayman-brain-health-relay-global-captive-management',
    from: 'Cayman Brain Health Relay contribution. Lead: Mr Daval Gregory, Software Developer. Description TBC.',
    to: 'Cayman Brain Health Relay contribution. Lead: Mr Daval Gregory, Software Developer.',
  },
  {
    slug: 'cayman-brain-health-relay-ruth-eleanor-mclaughlin-school-of-nursing-ucci',
    from: 'Cayman Brain Health Relay contribution. Lead: Professor Jusene Brown. Description TBC.',
    to: 'Cayman Brain Health Relay contribution. Lead: Professor Jusene Brown.',
  },
  {
    slug: 'cayman-brain-health-relay-wellness-team-portfolio-of-the-civil-service',
    from: 'Cayman Brain Health Relay contribution. Lead: Mrs Charmane Dalhouse-Morgan, Corporate Wellness Officer. Description TBC.',
    to: 'Cayman Brain Health Relay contribution. Lead: Mrs Charmane Dalhouse-Morgan, Corporate Wellness Officer.',
  },
  {
    slug: 'cayman-brain-health-relay-health-city-cayman-islands',
    from: 'Cayman Brain Health Relay contribution. Lead: Ms Rebekah Brooks, Head of Marketing and Sales. Description TBC.',
    to: 'Cayman Brain Health Relay contribution. Lead: Ms Rebekah Brooks, Head of Marketing and Sales.',
  },
  {
    slug: 'cayman-brain-health-relay-allstars-netball-club',
    from: 'Cayman Brain Health Relay contribution. Lead: Ms Lyneth Montieth, President; Ms Georgie Muir, Fundraising Coordinator (pre-recorded). Description TBC.',
    to: 'Cayman Brain Health Relay contribution. Lead: Ms Lyneth Montieth, President; Ms Georgie Muir, Fundraising Coordinator (pre-recorded).',
  },
  {
    slug: 'cayman-brain-health-relay-health-services-authority',
    from: 'Cayman Brain Health Relay contribution. Lead: Dr Sunku Guptha; Dr Dwaine Cooke. Description TBC.',
    to: 'Cayman Brain Health Relay contribution. Lead: Dr Sunku Guptha; Dr Dwaine Cooke.',
  },
  {
    slug: 'cayman-brain-health-relay-the-tullet-laboratory',
    from: 'Cayman Brain Health Relay contribution. Lead: Dr Jennifer Tullet (pre-recorded). Description TBC.',
    to: 'Cayman Brain Health Relay contribution. Lead: Dr Jennifer Tullet (pre-recorded).',
  },
  {
    slug: 'cayman-brain-health-relay-the-ezcurra-laboratory',
    from: 'Cayman Brain Health Relay contribution. Lead: Dr Marina Ezcurra (pre-recorded). Description TBC.',
    to: 'Cayman Brain Health Relay contribution. Lead: Dr Marina Ezcurra (pre-recorded).',
  },
  {
    slug: 'cayman-longevity-program-morning-relay-session',
    from: 'Cayman Longevity Program morning Relay session, led by Ms Christina Rowlandson, Co-founder. Title, scope and speaker list TBC.',
    to: 'Cayman Longevity Program morning Relay session, led by Ms Christina Rowlandson, Co-founder.',
  },
  {
    slug: 'cayman-brain-health-relay-st-matthew-s-university-school-of-medicine',
    from: 'Cayman Brain Health Relay contribution. Lead: Dr Maribel Aurelio; Dr Gimena Marzan (pre-recorded). Description TBC.',
    to: 'Cayman Brain Health Relay contribution. Lead: Dr Maribel Aurelio; Dr Gimena Marzan (pre-recorded).',
  },
  {
    slug: 'cayman-brain-health-relay-netball-cayman',
    from: 'Cayman Brain Health Relay contribution. Lead: Ms Teneisha Wilson, President (pre-recorded). Description TBC.',
    to: 'Cayman Brain Health Relay contribution. Lead: Ms Teneisha Wilson, President (pre-recorded).',
  },
  {
    slug: 'cayman-longevity-program-afternoon-relay-session',
    from: 'Cayman Longevity Program afternoon Relay session, led by Ms Christina Rowlandson, Co-founder. Title, scope and speaker list TBC.',
    to: 'Cayman Longevity Program afternoon Relay session, led by Ms Christina Rowlandson, Co-founder.',
  },
  {
    slug: 'living-wellness-legacy-asha-jones-brain-health-relay',
    from: 'Barbados Brain Health Relay contribution; participation TBC. Description TBC.',
    to: 'Barbados Brain Health Relay contribution.',
  },
  {
    slug: 'dr-roach-brain-health-relay',
    from: 'Barbados Brain Health Relay online contribution; participation TBC. Description TBC.',
    to: 'Barbados Brain Health Relay online contribution.',
  },
]

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('programme_descriptions: fresh database, content comes from pnpm db:seed')
    return
  }
  let updated = 0
  for (const { slug, from, to } of changes) {
    const { docs } = await payload.update({
      collection: 'sessions',
      where: { and: [{ slug: { equals: slug } }, { description: { equals: from } }] },
      data: { description: to },
      context: { disableRevalidate: true },
      req,
    })
    updated += docs.length
  }
  payload.logger.info(
    `programme_descriptions: ${updated} of ${changes.length} descriptions updated`,
  )
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('programme_descriptions down: content left in place')
}
