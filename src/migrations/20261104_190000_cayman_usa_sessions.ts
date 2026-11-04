import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { hasContent } from '@/seed/hasContent'

// New titles, end times, themes, venues and descriptions from the Cayman and United States
// programme update. Each session changes only while its title and description are still what
// production held, so an editor's copy is kept. The slug is passed so web addresses stay the
// same: the slug field would otherwise regenerate from the new title. A fresh database gets
// this from `pnpm db:seed`.
const changes: {
  slug: string
  fromTitle: string
  fromDescription: string
  title: string
  location: string
  theme: string
  startTime: string
  endTime: string
  venue: string | null
  description: string
}[] = [
  {
    slug: 'cayman-brain-health-relay-global-captive-management',
    fromTitle: 'Cayman Brain Health Relay — Global Captive Management',
    fromDescription:
      'Cayman Brain Health Relay contribution. Lead: Mr Daval Gregory, Software Developer.',
    title: 'Walking for Brain Health: Staff Wellness Walk',
    location: 'Cayman Islands',
    theme: 'Community',
    startTime: '10:00',
    endTime: '11:00',
    venue: null,
    description:
      'Global Captive Management staff will take part in a wellness walk highlighting the relationship between physical activity, wellbeing and brain health, encouraging movement during the working day and reflection on healthy everyday habits. Lead: Mr Daval Gregory, Software Developer. Internal event for staff only.',
  },
  {
    slug: 'cayman-brain-health-relay-ruth-eleanor-mclaughlin-school-of-nursing-ucci',
    fromTitle: 'Cayman Brain Health Relay — Ruth Eleanor McLaughlin School of Nursing, UCCI',
    fromDescription: 'Cayman Brain Health Relay contribution. Lead: Professor Jusene Brown.',
    title: 'Cayman Brain Health Relay — Ruth Eleanor McLaughlin School of Nursing, UCCI',
    location: 'Cayman Islands',
    theme: 'Community',
    startTime: '11:00',
    endTime: '12:00',
    venue: null,
    description:
      'Ruth Eleanor McLaughlin School of Nursing (UCCI) contribution to the Cayman Brain Health Relay. Coordination contact: Professor Jusene Brown, School of Nursing.',
  },
  {
    slug: 'cayman-brain-health-relay-wellness-team-portfolio-of-the-civil-service',
    fromTitle: 'Cayman Brain Health Relay — Wellness Team, Portfolio of the Civil Service',
    fromDescription:
      'Cayman Brain Health Relay contribution. Lead: Mrs Charmane Dalhouse-Morgan, Corporate Wellness Officer.',
    title: 'Brain Health Hour: Individual Brain-Boosting Activities',
    location: 'Cayman Islands',
    theme: 'Community',
    startTime: '12:00',
    endTime: '13:00',
    venue: null,
    description:
      'Civil Service employees take a break from their work routine to complete independent desk-based activities supporting memory, focus, creativity and relaxation: a memory challenge, brain games, mindful breathing, creative thinking and personal reflection. Lead: Dr Charmane Dalhouse-Morgan, Corporate Wellness Officer, Wellness Unit – Portfolio of the Civil Service. Internal event for participating employees.',
  },
  {
    slug: 'cayman-brain-health-relay-health-city-cayman-islands',
    fromTitle: 'Cayman Brain Health Relay — Health City Cayman Islands',
    fromDescription:
      'Cayman Brain Health Relay contribution. Lead: Ms Rebekah Brooks, Head of Marketing and Sales.',
    title: 'Cayman Brain Health Relay — Health City Cayman Islands',
    location: 'Cayman Islands',
    theme: 'Community',
    startTime: '13:00',
    endTime: '14:00',
    venue: null,
    description:
      'Internal staff contribution from Health City Cayman Islands; activity details have not yet been provided. Contact: Ms Rebekah Brooks, Head of Marketing and Sales. Internal event.',
  },
  {
    slug: 'cayman-brain-health-relay-allstars-netball-club',
    fromTitle: 'Cayman Brain Health Relay — AllStars Netball Club',
    fromDescription:
      'Cayman Brain Health Relay contribution. Lead: Ms Lyneth Montieth, President; Ms Georgie Muir, Fundraising Coordinator (pre-recorded).',
    title: 'Netball for Brain Health: Movement, Connection and Teamwork',
    location: 'Online',
    theme: 'Community',
    startTime: '14:00',
    endTime: '15:00',
    venue: null,
    description:
      'A pre-recorded video (about 30 minutes) from AllStars Netball Club showcasing how netball brings together physical activity, social connection, coordination, decision-making and teamwork. Players reflect on wellbeing, managing stress and supporting people and families affected by dementia. Leads: Ms Lyneth Montieth, President, and Ms Georgie Muir, Fundraising Coordinator.',
  },
  {
    slug: 'cayman-brain-health-relay-health-services-authority',
    fromTitle: 'Cayman Brain Health Relay — Health Services Authority',
    fromDescription:
      'Cayman Brain Health Relay contribution. Lead: Dr Sunku Guptha; Dr Dwaine Cooke.',
    title: 'Move, Play & Create for Brain Health',
    location: 'Cayman Islands',
    theme: 'Community',
    startTime: '15:00',
    endTime: '16:00',
    venue: 'Hibiscus Rooms, HSA',
    description:
      'Health Services Authority staff will take part in gait-speed tests, musical bingo and an art and colouring space, exploring mobility, cognition, creativity, social engagement and wellbeing. Leads: Dr Sunku Guptha, Internal Medicine Physician/Geriatrician, and Dr Dwaine Cooke, Neurosurgeon. Internal event for HSA staff only.',
  },
  {
    slug: 'cayman-brain-health-relay-the-tullet-laboratory',
    fromTitle: 'Cayman Brain Health Relay — The Tullet Laboratory',
    fromDescription:
      'Cayman Brain Health Relay contribution. Lead: Dr Jennifer Tullet (pre-recorded).',
    title: 'How the Brain Controls Health: Lessons from C. elegans',
    location: 'Online',
    theme: 'Research & Data',
    startTime: '09:00',
    endTime: '10:00',
    venue: null,
    description:
      'A pre-recorded research video (about 9 minutes) from the Tullet Laboratory on using the model organism C. elegans to investigate how a gene and neuronal signalling influence appetite, behaviour and metabolism. Lead: Dr Jennifer Tullet, Reader in Biogerontology.',
  },
  {
    slug: 'cayman-brain-health-relay-the-ezcurra-laboratory',
    fromTitle: 'Cayman Brain Health Relay — The Ezcurra Laboratory',
    fromDescription:
      'Cayman Brain Health Relay contribution. Lead: Dr Marina Ezcurra (pre-recorded).',
    title: 'How the microbiome affects health',
    location: 'Online',
    theme: 'Research & Data',
    startTime: '10:00',
    endTime: '11:00',
    venue: null,
    description:
      'A pre-recorded research talk (about 40 minutes) from the Ezcurra Laboratory exploring connections between the gut microbiome, health and neurodegeneration through studies using C. elegans. Lead: Dr Marina Ezcurra, Senior Lecturer in the Biology of Ageing.',
  },
  {
    slug: 'cayman-longevity-program-morning-relay-session',
    fromTitle: 'Cayman Longevity Program — Morning Relay Session',
    fromDescription:
      'Cayman Longevity Program morning Relay session, led by Ms Christina Rowlandson, Co-founder.',
    title: 'MedTech, Neuroimaging and the Patient Care Journey',
    location: 'Online',
    theme: 'Technology & Innovation',
    startTime: '11:00',
    endTime: '12:00',
    venue: null,
    description:
      'A Cayman Longevity Program webinar on the role of medical technology and neuroimaging in patient evaluation and the care journey. Lead: Ms Christina Rowlandson, Co-founder; additional speakers TBC.',
  },
  {
    slug: 'cayman-brain-health-relay-st-matthew-s-university-school-of-medicine',
    fromTitle: "Cayman Brain Health Relay — St Matthew's University School of Medicine",
    fromDescription:
      'Cayman Brain Health Relay contribution. Lead: Dr Maribel Aurelio; Dr Gimena Marzan (pre-recorded).',
    title: 'The PAVING Wheel: Practical Approaches to Health and Wellbeing',
    location: 'Online',
    theme: 'Community',
    startTime: '13:00',
    endTime: '14:00',
    venue: null,
    description:
      "A pre-recorded classroom session (up to 40 minutes) from St Matthew's University School of Medicine introducing the PAVING Wheel and practical lifestyle behaviours that support health and wellbeing. Leads: Dr Maribel Aurelio, Associate Dean of Basic Sciences, and Dr Gimena Marzan, Assistant Dean of Student Affairs.",
  },
  {
    slug: 'cayman-brain-health-relay-netball-cayman',
    fromTitle: 'Cayman Brain Health Relay — Netball Cayman',
    fromDescription:
      'Cayman Brain Health Relay contribution. Lead: Ms Teneisha Wilson, President (pre-recorded).',
    title: 'Netball, Music and Brain Health',
    location: 'Online',
    theme: 'Community',
    startTime: '14:00',
    endTime: '15:00',
    venue: null,
    description:
      'A pre-recorded video from Netball Cayman incorporating music to celebrate netball, movement and community engagement. Lead: Ms Teneisha Wilson, President.',
  },
  {
    slug: 'cayman-longevity-program-afternoon-relay-session',
    fromTitle: 'Cayman Longevity Program — Afternoon Relay Session',
    fromDescription:
      'Cayman Longevity Program afternoon Relay session, led by Ms Christina Rowlandson, Co-founder.',
    title: 'Everyday Habits, Cognitive Health and the Gut–Hormone–Brain Axis',
    location: 'Online',
    theme: 'Life-course',
    startTime: '15:00',
    endTime: '16:00',
    venue: null,
    description:
      "A Cayman Longevity Program webinar on preventing cognitive decline, mild cognitive impairment and early dementia through everyday habits and a precision/functional neurology approach, including the gut–hormone–brain axis and women's health. Lead: Ms Christina Rowlandson, Co-founder; additional speakers TBC.",
  },
  {
    slug: 'brain-health-empowerment-day-a-passport-to-a-stronger-brain',
    fromTitle: 'Brain Health Empowerment Day: A Passport to a Stronger Brain',
    fromDescription:
      'An interactive afternoon of brain-health learning, practical activities and community connection hosted by Resilient Health Communities. Using a Brain Boost Passport, participants visit four activity stops (reading aloud, simple maths, handwriting a reflection and exploring a practical next step), followed by a light lunch. A community education activity, not a diagnostic assessment.',
    title: 'Brain Health Empowerment Day: A Passport to a Stronger Brain',
    location: 'United States',
    theme: 'Community',
    startTime: '13:00',
    endTime: '15:00',
    venue: 'East County Community Center, 3310 Gateshead Manor Way, Silver Spring, MD 20904',
    description:
      'An interactive afternoon of brain-health learning, practical activities and community connection hosted by Resilient Health Communities. Using a Brain Boost Passport, participants visit four activity stops (reading aloud, simple maths, handwriting a reflection and exploring a practical next step), followed by a light lunch. A community education activity, not a diagnostic assessment. No advance registration or fee is required. Attendance is open, with seating on a first-come, first-seated basis, subject to venue capacity. For practical questions, contact Rhonda Baird on 301-655-9660.',
  },
]

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('cayman_usa_sessions: fresh database, content comes from pnpm db:seed')
    return
  }
  const idByName = async (collection: 'session-locations' | 'session-themes', name: string) => {
    const { docs } = await payload.find({
      collection,
      where: { name: { equals: name } },
      limit: 1,
      depth: 0,
      req,
    })
    if (!docs[0]) throw new Error(`cayman_usa_sessions: no ${collection} named ${name}`)
    return docs[0].id
  }
  let updated = 0
  for (const { slug, fromTitle, fromDescription, location, theme, ...data } of changes) {
    const { docs } = await payload.update({
      collection: 'sessions',
      where: {
        and: [
          { slug: { equals: slug } },
          { title: { equals: fromTitle } },
          { description: { equals: fromDescription } },
        ],
      },
      data: {
        ...data,
        slug,
        location: await idByName('session-locations', location),
        theme: await idByName('session-themes', theme),
      },
      context: { disableRevalidate: true },
      req,
    })
    updated += docs.length
  }
  payload.logger.info(`cayman_usa_sessions: ${updated} of ${changes.length} sessions updated`)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('cayman_usa_sessions down: content left in place')
}
