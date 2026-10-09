import type { DataFromGlobalSlug, RequiredDataFromCollectionSlug } from 'payload'

import type { Page } from '@/payload-types'

import { cookiesContent, privacyContent, termsContent } from './legal'
import { paragraph, paragraphs, richText } from './lexical'

// The site copy as it stood on `main` before T011 (SPEC §6.4). The content migration and
// `pnpm db:seed` apply it, creating only what is missing.

type Layout = NonNullable<Page['layout']>

export type SeedImages = {
  /** Header logo, from the Coming Soon global. */
  logo?: number
  /** Photo hero images, from the Coming Soon global's background. */
  hero: number[]
}

const statusLabels = { done: 'Done', now: 'We are here', next: 'Coming up' }

const roadmap = {
  kicker: 'The road ahead',
  heading: 'From consultation to policy',
  statusLabels,
  steps: [
    {
      when: 'Sep 2026',
      title: 'Dates announced',
      body: 'Summit week confirmed for November.',
      status: 'done',
    },
    {
      when: 'Sep–Nov 2026',
      title: 'Consultation open',
      body: 'Anyone can comment on the Call to Action.',
      status: 'now',
    },
    {
      when: '16–22 Nov 2026',
      title: 'Summit week',
      body: 'Free sessions across the region and online.',
      status: 'next',
    },
    {
      when: '3–5 Feb 2027',
      title: 'PLADRR, Kingston',
      body: 'The follow-on event continues the work.',
      status: 'next',
    },
    {
      when: '2027',
      title: 'Call to Action published',
      body: 'A shared agenda goes to governments.',
      status: 'next',
    },
  ],
} satisfies Partial<Extract<Layout[number], { blockType: 'roadmap' }>>

const actionAreas = {
  centreLabel: 'Caribbean brain health',
  areas: [
    {
      icon: 'users',
      title: 'Brain health as workforce and development capacity',
      body: "Brain health shapes the Caribbean's future workforce, family care capacity, productivity and economic resilience.",
    },
    {
      icon: 'landmark',
      title: 'Coordinated investment in brain-health infrastructure',
      body: 'The region needs practical infrastructure for prevention, care, participation, research, learning and collaboration.',
    },
    {
      icon: 'hand-heart',
      title: 'Workforce capacity and support for family carers',
      body: 'Primary care teams, care workers and families need practical knowledge, clear pathways and stronger support.',
    },
    {
      icon: 'graduation',
      title: 'Caribbean-specific evidence for Caribbean-specific action',
      body: 'The Caribbean needs evidence that reflects its own populations, cultures, health systems and diaspora realities.',
    },
    {
      icon: 'badge-check',
      title: 'Sustained coordination, review and accountability',
      body: 'Progress requires continuing relationships, shared learning and visible follow-through beyond Summit week.',
    },
  ],
} satisfies Partial<Extract<Layout[number], { blockType: 'actionAreas' }>>

const donateBanner = { blockType: 'donateBanner' } as const

export const teamSection = {
  blockType: 'team',
  kicker: 'Our team',
  heading: 'The people behind the Summit',
  intro:
    'The Summit is convened by Amagi Health, with country leads and liaisons in each host country.',
  background: 'white',
} as const

// Home, directly below the hero.
export const partnerBanner = {
  blockType: 'logoGrid',
  heading: 'Our partners',
  background: 'white',
  source: 'partners',
  display: 'marquee',
} as const

const photoHero = (
  images: SeedImages,
  hero: {
    kicker: string
    heading: string
    lead?: string
    showDonateButton?: boolean
    secondaryLink?: { label: string; href: string }
  },
) => ({
  blockType: 'hero' as const,
  style: 'photo' as const,
  images: images.hero,
  showDonateButton: false,
  ...hero,
})

const legalPage = (
  title: string,
  intro: string,
  content: Extract<Layout[number], { blockType: 'richText' }>['content'],
): Layout => [
  { blockType: 'hero', style: 'plain', heading: title, lead: intro, showDonateButton: false },
  { blockType: 'richText', layout: 'prose', background: 'white', content },
]

type SeedPage = RequiredDataFromCollectionSlug<'pages'>

const meta = (title: string) => ({ title: `${title} | Caribbean Brain Health Summit` })

type FormKey = Extract<Layout[number], { blockType: 'form' }>['form']

// A page that holds one form (SPEC §8.3).
const formPage = (
  images: SeedImages,
  page: { title: string; slug: string; kicker: string; lead: string; form: FormKey },
): SeedPage => ({
  title: page.title,
  slug: page.slug,
  meta: meta(page.title),
  layout: [
    photoHero(images, { kicker: page.kicker, heading: page.title, lead: page.lead }),
    { blockType: 'form', background: 'white', form: page.form },
    donateBanner,
  ],
})

export const formPages = (images: SeedImages): SeedPage[] => [
  formPage(images, {
    title: 'Register your interest',
    slug: 'register',
    kicker: 'Get involved',
    lead: "Tell us how you'd like to take part. We'll email you when the programme is published.",
    form: 'register-interest',
  }),
  formPage(images, {
    title: 'Partner with the Summit',
    slug: 'partner',
    kicker: 'Get involved',
    lead: 'Tell us about your organisation and how it could take part.',
    form: 'partner',
  }),
  formPage(images, {
    title: 'Propose a Brain Health Relay activity',
    slug: 'relay',
    kicker: 'Get involved',
    lead: 'Run an activity in your community during Summit week. Your country lead will be in touch.',
    form: 'relay',
  }),
  formPage(images, {
    title: 'Get in touch',
    slug: 'contact',
    kicker: 'Contact',
    lead: "General and media enquiries. We'll reply as soon as we can.",
    form: 'contact',
  }),
]

// Buttons that lead to the forms, from the pages Amagi's copy names (SPEC §8.3).
export const partnerLink = { label: 'Partner with the Summit', href: '/partner' }
export const registerLink = { label: 'Register interest', href: '/register' }
export const relayLink = { label: 'Host a Relay hour', href: '/relay' }
export const summitWeekNav = { label: 'Summit Week', href: '/summit-week' }

export const aboutContact = {
  blockType: 'cardGrid',
  heading: 'Contact and press enquiries',
  intro: "Questions about the Summit, or a media request? We'll reply as soon as we can.",
  background: 'pale',
  style: 'tiles',
  items: [],
  links: [{ label: 'Get in touch', href: '/contact' }],
} as const satisfies Layout[number]

// From Amagi's Summit Week copy (4 October 2026), cut down to a line per item: each section
// is a graphic first. The programme (T021) joins in Release 2; the Anchor Day date stays off
// the page until it is confirmed.
export const summitWeekPage = (images: SeedImages): SeedPage => ({
  title: 'Summit Week',
  slug: 'summit-week',
  meta: meta('Summit Week'),
  layout: [
    photoHero(images, {
      kicker: 'Summit Week · 16–22 November 2026',
      heading: 'One week. Many places. One shared agenda.',
      lead: 'Locally led activities across the Caribbean and the diaspora, connected online and brought together at an Anchor Day in Jamaica. Free to attend.',
      secondaryLink: { label: 'Register your interest', href: '/register' },
    }),
    {
      blockType: 'flow',
      kicker: 'How the week works',
      heading: 'The Summit goes where people are',
      background: 'pale',
      steps: [
        {
          title: 'Local hosts',
          body: 'Organisations in each country run activities shaped by local priorities.',
        },
        {
          title: 'Brain Health Relay',
          body: 'Community groups, professional bodies and diaspora networks each host an hour.',
        },
        { title: 'Online sessions', body: 'Connect people across islands and time zones.' },
        {
          title: 'Anchor Day',
          body: 'Turns what the region said into next steps for 2027 and beyond.',
        },
      ],
    },
    {
      blockType: 'cardGrid',
      kicker: 'Four streams',
      heading: 'Four ways the week comes together',
      background: 'white',
      style: 'tiles',
      // Titles become the programme's Stream filter values (T021): keep them exact.
      items: [
        {
          icon: 'landmark',
          title: 'Anchor Day',
          body: 'Families, carers, clinicians, employers and policymakers in one conversation in Jamaica. Date and venue to be announced.',
        },
        {
          icon: 'users',
          title: 'Country Weeks',
          body: 'Activities led by Jamaica, Barbados, Trinidad and Tobago, the Cayman Islands and The Bahamas.',
        },
        {
          icon: 'hand-heart',
          title: 'Brain Health Relay',
          body: 'Faith groups, schools, clubs and carers’ groups each host an hour, passed from one community to the next.',
          link: relayLink,
        },
        {
          icon: 'video',
          title: 'Online and Diaspora',
          body: 'Sessions open to anyone, anywhere, and activities hosted by diaspora communities in the UK, the US, Canada and beyond.',
        },
      ],
    },
    {
      blockType: 'summitWeek',
      kicker: 'The shape of the week',
      heading: 'Seven days, one region',
      background: 'pale',
      monthLabel: 'Nov',
      days: [
        { day: 'Mon', date: '16', label: 'Opening', body: 'The Summit opens and the Relay begins' },
        ...(['Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const).map((day, index) => ({
          day,
          date: String(17 + index),
          label: 'Across the region',
          body: 'Country Weeks, Relay and online sessions',
        })),
        { day: 'Sun', date: '22', label: 'Close', body: 'What was agreed, and what comes next' },
      ],
    },
    {
      blockType: 'cardGrid',
      kicker: 'Host something',
      heading: 'Could your organisation host something?',
      intro: 'A focused activity with a real next step matters more than size.',
      background: 'white',
      style: 'badges',
      items: [
        { icon: 'users', body: 'A caregiver conversation' },
        { icon: 'graduation', body: 'A training session' },
        { icon: 'megaphone', body: 'A talk at your place of worship or school' },
        { icon: 'video', body: 'A radio segment' },
        { icon: 'hand-heart', body: 'A walk' },
        { icon: 'badge-check', body: 'An hour of the Brain Health Relay' },
      ],
      links: [relayLink],
    },
    {
      blockType: 'cardGrid',
      heading: 'Can’t join live?',
      intro: 'Selected recordings will be shared after the week. Register for programme updates.',
      background: 'pale',
      style: 'tiles',
      items: [],
      links: [{ label: 'Register your interest', href: '/register' }],
    },
    donateBanner,
  ],
})

export const seedPages = (images: SeedImages): SeedPage[] => [
  {
    title: 'Home',
    slug: 'home',
    meta: { title: 'Caribbean Brain Health Summit 2026' },
    layout: [
      {
        blockType: 'hero',
        style: 'map',
        kicker: 'Caribbean Brain Health Summit · 16–22 November 2026',
        heading: 'One Caribbean.\nOne brain health future.',
        lead: 'A week of free sessions across the region and online, and a shared plan for what comes next. Your gift makes it happen.',
        showDonateButton: true,
        secondaryLink: registerLink,
        extraLink: partnerLink,
        // Summit week starts at midnight in Kingston (UTC-5, no daylight saving).
        countdown: {
          target: '2026-11-16T05:00:00.000Z',
          label: 'Summit week starts in',
          units: { days: 'days', hours: 'hours', minutes: 'minutes' },
        },
        stats: [
          { value: '7', label: 'days of free activity' },
          { value: '5', label: 'host countries' },
          { value: '1', label: 'Anchor Day in Jamaica' },
          { value: '5', label: 'action areas for policy' },
        ],
      },
      partnerBanner,
      {
        blockType: 'statement',
        // Source: WHO news release, 14 March 2024 (GBD 2021, The Lancet Neurology).
        text: 'More than 1 in 3 people worldwide live with a condition that affects the brain or nervous system.',
        source: 'World Health Organization, 2024',
      },
      {
        blockType: 'hostMap',
        kicker: 'Where it happens',
        heading: 'Across the region, and online',
        intro:
          'Each host country runs its own programme of free, local activity. Online sessions let anyone in the region or the diaspora join in.',
        background: 'blue',
        onlineLabel: 'Plus online sessions, open to everyone',
        anchorLabel: 'Anchor Day',
        // x and y are positions on the map's own grid (see caribbeanMap.ts).
        countries: [
          { name: 'Jamaica', city: 'Kingston', x: 365, y: 285, anchor: true, labelSide: 'left' },
          { name: 'The Bahamas', city: 'Nassau', x: 349, y: 73, labelSide: 'right' },
          { name: 'Barbados', city: 'Bridgetown', x: 858, y: 432, labelSide: 'left' },
          { name: 'Trinidad and Tobago', city: 'Port of Spain', x: 803, y: 506, labelSide: 'left' },
          { name: 'Cayman Islands', city: 'George Town', x: 233, y: 246, labelSide: 'left' },
        ],
      },
      {
        blockType: 'summitWeek',
        kicker: 'Summit week',
        heading: 'Seven days, one region',
        intro: 'Local activity runs all week. The Anchor Day takes place in Jamaica.',
        background: 'white',
        anchorId: 'week',
        monthLabel: 'Nov',
        days: [
          { day: 'Mon', date: '16', label: 'Opening', body: 'Launch events in every host country' },
          {
            day: 'Tue',
            date: '17',
            label: 'Local activity',
            body: 'Community sessions and screenings',
          },
          { day: 'Wed', date: '18', label: 'Local activity', body: 'Workshops for practitioners' },
          {
            day: 'Thu',
            date: '19',
            label: 'Anchor Day',
            body: 'The Anchor Day takes place in Jamaica',
            anchor: true,
          },
          { day: 'Fri', date: '20', label: 'Local activity', body: 'Youth and family sessions' },
          { day: 'Sat', date: '21', label: 'Online day', body: 'Sessions for the diaspora' },
          { day: 'Sun', date: '22', label: 'Close', body: 'Reflections and next steps' },
        ],
      },
      {
        blockType: 'roadmap',
        ...roadmap,
        intro:
          'The Summit is one step on a longer road. Here’s where we are and what your support carries forward.',
        background: 'pale',
        numbered: false,
      },
      {
        blockType: 'actionAreas',
        kicker: 'Caribbean Call to Action on Brain Health',
        heading: 'Five areas for action',
        intro:
          'A policy statement shaped by communities, practitioners and policymakers. Summit week feeds straight into it.',
        background: 'white',
        ...actionAreas,
        link: { label: 'Read the Call to Action', href: '/call-to-action' },
      },
      donateBanner,
      {
        blockType: 'newsTeaser',
        kicker: 'News',
        heading: 'Latest from the Summit',
        background: 'white',
        limit: 3,
        linkLabel: 'All news',
      },
    ],
  },
  {
    title: 'About',
    slug: 'about',
    meta: meta('About'),
    layout: [
      {
        ...photoHero(images, {
          kicker: 'About the Summit',
          heading: 'A week for Caribbean brain health',
          lead: 'The Caribbean Brain Health Summit runs from 16 to 22 November 2026, in several Caribbean countries and online.',
        }),
        stats: [
          { value: '7', label: 'days of activity, 16–22 November 2026' },
          { value: 'Hybrid', label: 'in person across the region and online' },
          { value: 'Free', label: 'for the public to attend' },
        ],
      },
      {
        blockType: 'richText',
        kicker: 'About the Summit',
        heading: 'Why a Summit',
        background: 'white',
        layout: 'split',
        content: paragraphs(
          'Brain health touches every family in the Caribbean, through dementia, stroke, mental health and healthy ageing. The Summit brings communities, practitioners, researchers and policymakers together to share what works and agree what comes next.',
        ),
      },
      {
        blockType: 'flow',
        kicker: 'How it works',
        heading: 'From one convener to every community',
        background: 'pale',
        steps: [
          {
            title: 'Amagi Health',
            body: 'Convenes the Summit and leads the Call to Action consultation.',
          },
          { title: 'Country leads', body: 'Plan each host country’s week with local partners.' },
          { title: 'Activity hosts', body: 'Run free sessions on the ground and online.' },
          {
            title: 'Communities',
            body: 'Take part, share what works and shape what comes next.',
          },
        ],
      },
      {
        blockType: 'roadmap',
        ...roadmap,
        intro:
          'The conversation continues at PLADRR, a follow-on event in Kingston from 3 to 5 February 2027.',
        background: 'white',
        numbered: false,
      },
      aboutContact,
      teamSection,
      donateBanner,
    ],
  },
  {
    title: 'Support Caribbean Brain Health',
    slug: 'support',
    meta: meta('Support'),
    layout: [
      photoHero(images, {
        kicker: 'Support Caribbean brain health',
        heading: 'Your support makes the Summit possible',
        lead: 'The Summit is free for the public. Donations and supporters pay for the sessions, the people who run them and the work that follows.',
        showDonateButton: true,
        secondaryLink: partnerLink,
      }),
      {
        blockType: 'cardGrid',
        heading: 'What your support enables',
        background: 'white',
        style: 'tiles',
        items: [
          {
            icon: 'users',
            title: 'Free local sessions',
            body: 'Community activities in each host country, open to everyone.',
          },
          {
            icon: 'video',
            title: 'Online access',
            body: 'Sessions streamed so people across the region and the diaspora can join.',
          },
          {
            icon: 'hand-heart',
            title: 'Local activity hosts',
            body: 'Support for the people and organisations who run activities on the ground.',
          },
          {
            icon: 'file-text',
            title: 'A Call to Action',
            body: 'A regional consultation that turns the week into lasting policy change.',
          },
        ],
      },
      donateBanner,
      {
        blockType: 'supporterLevels',
        kicker: 'For organisations',
        heading: 'Supporter levels',
        intro:
          "If your organisation is interested in supporting CBHS, we will develop a proposal that reflects your priorities while preserving the Summit's independence.",
        background: 'white',
        levels: [
          {
            name: 'Founding Regional Supporter',
            body: 'Enables core Caribbean brain-health infrastructure across digital access, country participation, independent convening and accountable follow-through.',
          },
          {
            name: 'Regional Supporter',
            body: 'Helps extend participation, connection and learning across Caribbean countries and diaspora communities.',
          },
          {
            name: 'Access & Participation Supporter',
            body: 'Enables a defined public-interest area, such as caregiver inclusion, country leadership, primary-care education, digital access or lived-experience participation.',
          },
          {
            name: 'Community Supporter',
            body: 'Provides financial or in-kind support that helps local and regional CBHS activity remain accessible, inclusive and independently delivered.',
          },
        ],
      },
      {
        blockType: 'cardGrid',
        heading: 'Our safeguards',
        background: 'blue',
        style: 'badges',
        items: [
          {
            icon: 'scale',
            body: 'Supporters do not control programme content, speakers, participant selection, research, policy recommendations or the Call to Action.',
          },
          {
            icon: 'badge-check',
            body: 'Supporters do not receive attendee contact lists, individual-level analytics or direct-marketing rights.',
          },
          {
            icon: 'lock',
            body: "Support does not imply endorsement of a supporter's products or commercial interests.",
          },
          {
            icon: 'file-text',
            body: 'Supporter recognition is separate from educational, clinical, research and policy content.',
          },
        ],
      },
      {
        blockType: 'logoGrid',
        heading: 'Our supporters',
        background: 'white',
        source: 'supporters',
        display: 'grid',
        emptyText: "Supporters will appear here once they've given permission to be named.",
      },
      {
        blockType: 'faqList',
        heading: 'Questions about supporting',
        background: 'white',
        category: 'Donations and support',
        showCategories: false,
      },
    ],
  },
  {
    title: 'Call to Action',
    slug: 'call-to-action',
    meta: meta('Call to Action'),
    layout: [
      photoHero(images, {
        kicker: 'Caribbean Call to Action on Brain Health',
        heading: 'A shared agenda for Caribbean brain health',
        lead: 'The Caribbean Call to Action on Brain Health is a policy statement shaped by communities, practitioners and policymakers across the region.',
      }),
      {
        blockType: 'actionAreas',
        kicker: 'The framework',
        heading: 'Five action areas',
        intro:
          'It sets out five areas where action would make the biggest difference to brain health in the Caribbean. Amagi is consulting on it before and during Summit week.',
        background: 'white',
        ...actionAreas,
      },
      {
        blockType: 'roadmap',
        kicker: 'How the consultation works',
        heading: 'Your voice, in four steps',
        background: 'pale',
        numbered: true,
        statusLabels,
        steps: [
          { title: 'Read', body: 'Explore the five action areas.', status: 'done' },
          { title: 'Comment', body: 'Tell us what matters where you live.', status: 'now' },
          {
            title: 'Review',
            body: 'Amagi reviews every response after Summit week.',
            status: 'next',
          },
          { title: 'Publish', body: 'The final Call to Action is shared in 2027.', status: 'next' },
        ],
      },
      {
        blockType: 'form',
        heading: 'Have your say',
        intro: 'Help shape the Caribbean Call to Action on Brain Health.',
        background: 'white',
        form: 'cta-consultation',
      },
      donateBanner,
    ],
  },
  ...formPages(images),
  summitWeekPage(images),
  {
    title: 'FAQs',
    slug: 'faqs',
    meta: meta('FAQs'),
    layout: [
      photoHero(images, {
        kicker: 'FAQs',
        heading: 'Frequently asked questions',
        secondaryLink: registerLink,
      }),
      { blockType: 'faqList', background: 'white', showCategories: true },
      donateBanner,
    ],
  },
  {
    title: 'News',
    slug: 'news',
    meta: meta('News'),
    layout: [
      photoHero(images, { kicker: 'News', heading: 'Latest from the Summit' }),
      { blockType: 'newsTeaser', background: 'white', showAll: true, limit: 12 },
      donateBanner,
    ],
  },
  {
    title: 'Privacy',
    slug: 'privacy',
    meta: meta('Privacy'),
    layout: legalPage(
      'Privacy policy',
      'How Amagi Health Ltd collects, uses and protects personal data on this site.',
      privacyContent,
    ),
  },
  {
    title: 'Cookies',
    slug: 'cookies',
    meta: meta('Cookies'),
    layout: legalPage(
      'Cookies',
      'The cookies and similar technologies this site uses, and how to control them.',
      cookiesContent,
    ),
  },
  {
    title: 'Terms',
    slug: 'terms',
    meta: meta('Terms'),
    layout: legalPage(
      'Terms of use',
      'The terms for using this website and donating through it.',
      termsContent,
    ),
  },
]

// Amagi confirmed permission for all seven (Ishtar Govia, 8 October 2026). Logo files are in
// src/seed/media/partners; the seed leaves them out because CI has no storage, and the
// release_1_content migration uploads them on existing databases.
// TODO: confirm RDS's full name with Amagi.
export const partnerLogos = [
  { name: 'Angels of the West Indies', file: 'angels-of-the-west-indies.webp' },
  { name: 'Caribbean Tech Collective', file: 'caribbean-tech-collective.webp' },
  { name: 'RDS', file: 'rds.webp' },
  { name: 'Resilient Health Communities', file: 'resilient-health-communities.webp' },
  { name: "The British Caribbean Doctors' and Dentists Association", file: 'bcdd.webp' },
  {
    name: "Virgin Islands Alzheimer's Association",
    file: 'virgin-islands-alzheimers-association.webp',
  },
  { name: 'World Dementia Council', file: 'world-dementia-council.webp' },
]

export const seedPartners: RequiredDataFromCollectionSlug<'partners'>[] = partnerLogos.map(
  ({ name }) => ({ name, permissionConfirmed: true }),
)

export const seedNews: RequiredDataFromCollectionSlug<'news'>[] = [
  {
    title: 'Summit dates announced: 16–22 November 2026',
    slug: 'summit-dates-announced',
    publishedDate: '2026-09-01T00:00:00.000Z',
    type: 'news',
    summary:
      'The Caribbean Brain Health Summit will run for a week across several Caribbean countries and online.',
    body: paragraphs(
      'The Caribbean Brain Health Summit will run from 16 to 22 November 2026, with activities in several Caribbean countries and sessions online.',
      'Each host country will run its own programme of free local activities, and an Anchor Day in Jamaica will bring the region together.',
    ),
  },
  {
    title: 'Consultation on the Caribbean Call to Action on Brain Health',
    slug: 'call-to-action-consultation',
    publishedDate: '2026-09-15T00:00:00.000Z',
    type: 'news',
    summary:
      'Communities, practitioners and policymakers are invited to help shape the Call to Action.',
    body: paragraphs(
      'Amagi is consulting on the Caribbean Call to Action on Brain Health, a policy statement setting out five areas for action.',
      'Taking part in the consultation is not an endorsement of the Call to Action.',
    ),
  },
  {
    title: 'PLADRR follows the Summit in February 2027',
    slug: 'pladrr-2027',
    publishedDate: '2026-09-28T00:00:00.000Z',
    type: 'news',
    summary:
      'A follow-on event in Kingston from 3 to 5 February 2027 will continue the conversation.',
    body: richText(
      paragraph(
        'PLADRR will take place in Kingston from 3 to 5 February 2027, building on the work of Summit week.',
      ),
    ),
  },
]

const faqGroups = [
  {
    category: 'About the Summit',
    items: [
      {
        question: 'When is the Summit?',
        answer: 'From 16 to 22 November 2026, in several Caribbean countries and online.',
      },
      {
        question: 'Does it cost anything to attend?',
        answer: 'No. Summit sessions are free for the public, in person and online.',
      },
      {
        question: 'Where is the Anchor Day?',
        answer: "In Jamaica. We'll publish the venue and timings here once they're confirmed.",
      },
    ],
  },
  {
    category: 'Taking part',
    items: [
      {
        question: 'How do I stay updated?',
        answer: "Register your interest and we'll email you when the programme is published.",
      },
      {
        question: 'Can my organisation run an activity?',
        answer:
          'Yes. Activity hosts run local sessions during Summit week. Contact us to find out more.',
      },
    ],
  },
  {
    category: 'Donations and support',
    items: [
      {
        question: 'How are donations processed?',
        answer: 'Securely through Stripe. We never see or store your card details.',
      },
      {
        question: 'Will I get a receipt?',
        answer: 'Yes. Stripe emails you a receipt as soon as your payment goes through.',
      },
      {
        question: 'Can my organisation become a supporter?',
        answer:
          'Yes. See the supporter levels on our Support page, or contact us to talk it through.',
      },
    ],
  },
]

// `order` keeps the categories and questions in their original sequence.
export const seedFaqs: RequiredDataFromCollectionSlug<'faqs'>[] = faqGroups.flatMap(
  ({ category, items }, groupIndex) =>
    items.map((item, index) => ({ ...item, category, order: groupIndex * 10 + index })),
)

type Globals = {
  [S in 'header' | 'footer' | 'donation-settings' | 'cookie-consent' | 'dropdowns' | 'forms']: Omit<
    Partial<DataFromGlobalSlug<S>>,
    'id' | 'updatedAt' | 'createdAt' | '_status'
  >
}

export const seedGlobals = (images: SeedImages): Globals => ({
  header: {
    logo: images.logo,
    brandTitle: 'Caribbean Brain\nHealth Summit',
    navItems: [
      { label: 'About', href: '/about' },
      summitWeekNav,
      { label: 'Support Caribbean Brain Health', href: '/support' },
      { label: 'Call to Action', href: '/call-to-action' },
      { label: 'News', href: '/news' },
      { label: 'FAQs', href: '/faqs' },
    ],
    donateLabel: 'Donate',
  },
  footer: {
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Terms', href: '/terms' },
      { label: 'Contact', href: '/contact' },
    ],
    tagline: 'One Caribbean. One Brain Health Future.',
    legalText:
      '© 2026 Amagi Health Ltd. The Caribbean Brain Health Summit is a convening of Amagi Health Ltd.',
  },
  'donation-settings': {
    suggestedAmounts: [2500, 5000, 10000, 25000].map((amount) => ({ amount })),
    currency: 'usd',
    allowCustomAmount: true,
    minimumAmount: 500,
    checkoutItemName: 'Donation to Caribbean brain health',
    checkoutItemDescription:
      'Supporting a Caribbean-led response to brain health, dementia, ageing and family care.',
    page: {
      kicker: 'Support the movement',
      heading: 'Help build a stronger regional response',
      lead: 'Brain health, dementia, ageing and family care need a Caribbean response, led from the Caribbean. The Caribbean Brain Health Summit connects the people, knowledge, services and institutions to build it. To stay open, accessible, locally led and independently governed, this work needs your support.',
      reasonsHeading: 'What your gift supports',
      reasons: [
        { text: 'Digital access' },
        { text: 'Country leadership' },
        { text: 'Caregiver and lived-experience inclusion' },
        { text: 'Primary care and workforce readiness' },
        { text: 'Measurement and accountability' },
        { text: 'Independent programme delivery and follow-through' },
      ],
      note: 'Amagi Health Ltd runs the Summit.',
      amountLegend: 'Choose an amount',
      otherLabel: 'Other',
      otherAmountLabel: 'Other amount (USD)',
      otherAmountHint: 'Select “Other” and enter at least {minimum}.',
      submitLabel: 'Continue to payment',
      securePaymentNote: 'You’ll pay securely on Stripe’s checkout page.',
      errorText: 'Please choose an amount, or enter one of at least {minimum}.',
    },
    thankYouKicker: '{amount} received',
    thankYouHeading: 'Thank you for your donation',
    thankYouBody:
      'Your gift helps build a Caribbean-led response to brain health, during Summit week and long after it.',
    thankYouLinkLabel: 'Back to the homepage',
    unconfirmedHeading: 'We couldn’t confirm your donation',
    unconfirmedBody:
      'If you completed a payment, you’ll get a receipt from Stripe by email. Otherwise you can try again.',
    unconfirmedLinkLabel: 'Back to donate',
    banner: {
      heading: 'Help build a stronger regional response',
      body: 'Back a Caribbean-led movement for brain health, dementia and family care.',
      label: 'Donate',
    },
  },
  'cookie-consent': { settingsLabel: 'Cookie settings' },
  // SPEC §5.3. Territories and industries are left for Amagi to enter.
  dropdowns: {
    audienceTypes: [
      { label: 'Country lead', value: 'country_lead' },
      { label: 'Activity host', value: 'activity_host' },
      { label: 'Partner organisation', value: 'partner_organisation' },
      { label: 'Supporter', value: 'supporter' },
      { label: 'Connector', value: 'connector' },
      { label: 'Lived experience', value: 'lived_experience' },
      { label: 'Researcher or clinician', value: 'researcher_clinician' },
      { label: 'Media', value: 'media' },
      { label: 'Diaspora', value: 'diaspora' },
      { label: 'General public', value: 'general_public' },
    ],
  },
  // Placeholder copy until Amagi supplies it (SPEC §8.4).
  forms: {
    thankYou: [
      {
        form: 'register-interest',
        heading: 'Thank you for registering your interest',
        body: "We'll email you when the programme is published.",
      },
      {
        form: 'cta-consultation',
        heading: 'Thank you for joining the consultation',
        body: "We'll be in touch about the Caribbean Call to Action on Brain Health. Registering is not an endorsement of the Call to Action.",
      },
      {
        form: 'partner',
        heading: 'Thank you for your interest in partnering',
        body: "We'll be in touch to talk about how your organisation could take part.",
      },
      {
        form: 'relay',
        heading: 'Thank you for proposing an activity',
        body: 'Your country lead will be in touch about your Brain Health Relay activity.',
      },
      {
        form: 'contact',
        heading: 'Thank you for getting in touch',
        body: "We've received your message and will reply as soon as we can.",
      },
    ],
  },
})

// From Amagi's team folder (9 October 2026). Headshots are in src/seed/media/team, cropped square;
// like partner logos, the seed leaves them out and the team_content migration uploads them.
// TODO: confirm each person's role (country lead or liaison) with Amagi.
export const teamMembers: (RequiredDataFromCollectionSlug<'team'> & { photoFile: string })[] = [
  {
    name: 'Dr Ishtar Govia',
    role: 'Convenor',
    order: 1,
    photoFile: 'ishtar-govia.webp',
    bio: 'Dr Ishtar Govia convenes the Caribbean Brain Health Summit 2026 and is Founder and CEO of Amagi Health Ltd. A former Senior Advisor at the World Health Organization, she serves as a Nominated Member of the World Dementia Council, Board Member of the Caribbean Policy Research Institute, a Clinical Committee Member of the Bellevue Hospital in Jamaica, and Vice President of the Caribbean Alliance of National Psychological Associations. Her work focuses on building regional infrastructure for brain health, dementia and healthy ageing — connecting Caribbean families, clinicians, researchers, employers, policy and the diaspora in a shared agenda for 2027 and beyond.',
  },
  {
    name: 'Kimberley Benjamin',
    country: 'Barbados',
    order: 10,
    photoFile: 'kimberley-benjamin.webp',
    bio: [
      'Kimberley Benjamin is an Atlantic Fellow, a lifelong community of experts across many disciplines united by the shared aim of advancing fairer, healthier and more equitable societies. She completed the Atlantic Fellowship for Equity in Brain Health at the Global Brain Health Institute, Trinity College Dublin, obtaining a Postgraduate certificate in Equity in Brain Health in the process and leading a project on Ageing, Brain Health and Cognitive Impairment in Irish Prisons.',
      'As a lawyer specialising in health and human rights law, Kimberley’s work focuses on the intersection of health and human rights for people experiencing vulnerability, with a particular emphasis on older adults, persons living with dementia and their care partners, to advance rights-based approaches to care. She is currently the Principal Investigator of the ‘Because We Care: Advancing Care Rights and Supports’ project – Barbados’ first rights based, digitally accessible mapping of dementia supports, services and institutions. Kimberley is a member of the Barbados Alzheimer’s Association, supporting national advocacy efforts, including the coordination of conferences about dementia.',
      'She has also worked on various human rights and or health law-related projects with the Inter-American Commission on Human Rights, the Pan American Health Organization, Healthy Caribbean Coalition and the Caribbean Court of Justice Academy for Law. She also served as an intern at the United Nations Development Program Subregional Office for Barbados and the Organization of Eastern Caribbean States.',
      'Kimberley earned a Masters in National and Global Health Law with certification in International Human Rights Law from Georgetown University in Washington D.C. and a Masters in Legislative Drafting from the University of the West Indies. She is a 2021-2023 Healthy Food Law and Policy Scholar and Fellow with the Global Center for Legal Innovation on Food Environments, O’Neill Institute for National and Global Health Law and a Fulbright Scholar with a passion for fostering local, regional and international collaborations.',
    ].join('\n\n'),
  },
  {
    name: 'Dr Melanie Taylor-John',
    country: 'Barbados',
    order: 11,
    photoFile: 'melanie-taylor-john.webp',
    bio: 'Dr. Melanie Taylor-John is a Barbadian physician and clinical and translational researcher with more than five years of experience in medicine and research. Her work focuses on non-communicable diseases and dementia, with an emphasis on improving the representation of historically underserved populations, particularly Afro-Caribbean communities and older adults, in clinical research. Through translational research, she bridges scientific discovery and clinical practice to advance more proactive and equitable approaches to understanding, preventing, and managing non-communicable diseases regionally.',
  },
  {
    name: 'Dr Noviann McLean-Gregory',
    country: 'Cayman Islands',
    order: 20,
    photoFile: 'noviann-mclean-gregory.webp',
    bio: 'Dr. Noviann McLean-Gregory is a PhD-trained research scientist whose work spans ageing biology, metabolic health, neuroscience, and public health. She completed her PhD at the University of Kent through the South Coast Biosciences Doctoral Training Partnership, with part of her project published in PLOS Genetics in August 2026. Her research used Caenorhabditis elegans to study appetite regulation, longevity, and disease pathways. In the Cayman Islands, she supports molecular biology, dementia education, and health policy, including work on perinatal health, obesity, and lifestyle-related diseases. She is also active in netball and several professional scientific societies.',
  },
  {
    name: 'Abigail Evans',
    country: 'Jamaica',
    order: 30,
    photoFile: 'abigail-evans.webp',
    bio: [
      'Abigail Evans is a Human Resources professional, counsellor, research officer and mental health advocate with a background in psychology, management and administration.',
      'At R Hotel Kingston, Abigail blends the heart of a counsellor with the discipline of an HR leader. As Human Resources Manager, she leads recruitment, performance management, employee relations, training, policy development and staff wellness initiatives, building a culture where people feel supported and excellence is expected. She also lends her expertise to the hotel’s operations and general management.',
      'Abigail’s commitment to mental health runs alongside her HR career. She is a counsellor at SafeSpot Ja, Jamaica’s first child helpline, operated by the Office of the Children’s Advocate. After serving as Administrator and Research Officer at the Jamaica Mental Health Advocacy Network (JAMHAN), she joined Amagi Health Ltd as Research Officer and Administrator. There she supports programme research, evaluation and delivery across its Caribbean Programmes. She also provides administrative consultancy services.',
      'Abigail holds a Bachelor of Science in Psychology and Management Studies from the University of the West Indies, Mona, and certificates in Human Resource Management and Hotel Operations Management from Northern Caribbean University. She is currently pursuing the Commonwealth Executive MBA (CEMBA) at the University of the Commonwealth Caribbean. Her professional training includes workplace investigations, interviewing, performance management and workplace law. Her counselling training includes child safeguarding, child-centred communication and trauma, attachment and relational approaches.',
      'She is an affiliate member of the Jamaican Psychological Association and a member of the Human Resource Management Association of Jamaica (HRMAJ). She previously served as a Director of Think Mental Health Jamaica and as a volunteer counsellor with U-Matter.',
      'An avid reader, Abigail is committed to helping young people develop a love of reading and to championing the wellbeing and inclusion of marginalised groups. She is passionate about building healthy, people-centred workplaces and advancing mental health care in Jamaica through education, advocacy and leadership.',
    ].join('\n\n'),
  },
  {
    name: 'Dr Khrystal Binns-Lee',
    country: 'Jamaica',
    order: 31,
    photoFile: 'khrystal-binns-lee.webp',
    bio: 'Dr. Khrystal Binns-Lee is a Jamaican medical doctor with postgraduate training in gerontology and a special interest in brain health, dementia prevention and healthy ageing. She holds an MBBS (Bachelor of Medicine, Bachelor of Surgery Degree) and a Master of Public Health in Gerontology, and is currently pursuing a Postgraduate Diploma in Geriatric Medicine at the University of the West Indies, Mona. As the lead physician of the Claremont Centre of Excellence Geriatric Clinic (the first and only geriatric clinic in the island) and the founder of the Claremont Senior Citizens Wellness Club, she champions community-based care, early recognition of cognitive decline and support for older adults and their families. Her work brings together clinical care, health education and social engagement to promote cognitive wellbeing and quality of life.',
  },
  {
    name: 'Dr Lauren-Paige Reid',
    country: 'Jamaica',
    order: 32,
    photoFile: 'lauren-paige-reid.webp',
    bio: [
      'Dr. Lauren-Paige Reid is a Jamaican medical doctor with a focus on Brain Health and Mental Health and a strong commitment to advocacy, leadership, and community empowerment. She currently serves as a District Medical Officer in Psychiatry with the Kingston and St. Andrew Health Department’s Community Mental Health Services and provides primary care services at MobiCare Medical Center, reflecting her commitment to delivering comprehensive care across the spectrum of health.',
      'As a Certified Brain Health Navigator and active member of the Jamaica Psychiatric Association, Dr. Reid also serves as the Amagi Jamaica Programme Lead, where she has contributed to the implementation of the Brain Train Programme and Dementia Moments Experience Jamaica, initiatives focused on dementia prevention, brain health promotion and caregiver education.',
      'She is also the Jamaica Mental Health Lead for the CASSM Foundation, coordinating mental health outreach initiatives across rural and urban communities in Jamaica. Her work extends beyond the office walls to community mental health advocacy, and public education.',
      'A proud graduate of The University of the West Indies, where she earned her Bachelor of Medical Sciences and MBBS degrees, Dr. Reid continues to champion an approach to healthcare that recognizes the correlation of the mind, body, and soul. Through her clinical, advocacy and community work, she remains committed to promoting brain and mental health awareness, supporting wholistic wellness, and building healthier, more resilient communities.',
    ].join('\n\n'),
  },
  {
    name: 'Dr Naila Edwards',
    country: 'Tobago',
    order: 40,
    photoFile: 'naila-edwards.webp',
    bio: "Dr. Naila Edwards is a board-certified internist and geriatrician who completed specialist training through the Harvard Medical School Multi-Campus Geriatric Medicine Fellowship. She currently serves as a Specialist Medical Officer in Internal Medicine at Roxborough Hospital, Tobago Regional Health Authority, where she leads the implementation of the Caribbean's first Age-Friendly Health Systems outpatient initiative outside of U.S. territory.",
  },
  {
    name: 'Michèle Saunders Clavery',
    country: 'Trinidad',
    order: 41,
    photoFile: 'michele-saunders-clavery.webp',
    bio: [
      'A lifelong educator with forty-three (43) years in the field of education, spanning both secondary and tertiary levels, Ms. Saunders Clavery holds a Master’s Degree in Education (UWI); a postgraduate professional teaching diploma in education (Dip. Ed, UWI); LCCI Diploma in Marketing, Advertising, and Public Relations; and a B. A. in English and Political Science (Concordia University, Montreal). Michèle recently retired as Head of the Continuing Studies department at the Cipriani College of Labour and Co-operative Studies, CCLCS where she also headed both the Developmental Education and General Education departments. She was also Senior Lecturer at CCLCS and served for three terms as Head of the Writing and Editing Committee Self Study for accreditation. Ms. Saunders Clavery is an adjunct lecturer at UWI-ROYTEC, and a columnist for the Anglican Outlook newspaper.',
      'Outside of her professional commitments, Ms. Saunders Clavery has been volunteering with the Alzheimer’s Association of Trinidad and Tobago, (AzATT) for the past twenty (20) years, serving as Vice President, then President. She is trained in the Dementia Capable Care programme and delivers workshops and talks followed by Q&A sessions. Recently, Ms. Saunders Clavery represented AzATT at the 37th Alzheimer’s Disease International Global Conference in France, April 2026 where she delivered a paper titled, “Bridging the Gap Through Education and Training for Informal Carers of Individuals Living with Dementia: A Social Justice Imperative.”',
    ].join('\n\n'),
  },
]

export const seedTeam: RequiredDataFromCollectionSlug<'team'>[] = teamMembers.map(
  ({ photoFile: _photoFile, ...member }) => ({ ...member, _status: 'published' }),
)
