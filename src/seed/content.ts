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

const photoHero = (
  images: SeedImages,
  hero: { kicker: string; heading: string; lead?: string; showDonateButton?: boolean },
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
        secondaryLink: {
          label: 'Register interest',
          href: 'https://docs.google.com/forms/d/e/1FAIpQLSc6bRt1sDcugHVcBylaqHgDqZ9rNUSHuVYmacJZk0UbQZ7lnQ/viewform',
        },
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
      {
        blockType: 'logoGrid',
        heading: 'Our partners',
        background: 'white',
        source: 'partners',
        display: 'marquee',
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
        intro:
          'The consultation form will open here. Registering your interest in the consultation is not an endorsement of the Call to Action.',
        background: 'white',
        form: 'cta-consultation',
      },
      donateBanner,
    ],
  },
  {
    title: 'FAQs',
    slug: 'faqs',
    meta: meta('FAQs'),
    layout: [
      photoHero(images, { kicker: 'FAQs', heading: 'Frequently asked questions' }),
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

// TODO: confirm RDS's full name with Amagi. Logos are uploaded in the admin (CI has no storage),
// and permission is ticked here only so local databases show the banner: on production an editor
// ticks it once each partner has agreed (CLAUDE.md hard rules).
export const seedPartners: RequiredDataFromCollectionSlug<'partners'>[] = [
  'Angels of the West Indies',
  'Caribbean Tech Collective',
  'RDS',
  'Resilient Health Communities',
  "The British Caribbean Doctors' and Dentists Association",
  "Virgin Islands Alzheimer's Association",
  'World Dementia Council',
].map((name) => ({ name, permissionConfirmed: true }))

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
      // Placeholder address until Amagi confirms it; Release 2 replaces it with /contact.
      { label: 'Contact', href: 'mailto:info@amagibrainhealth.org' },
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
