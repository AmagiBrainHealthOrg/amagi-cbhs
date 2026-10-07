// Placeholder copy for the v1 design variation. Each export is shaped like the Payload block
// it will become, so editors can manage the graphics later.
// TODO: hard-coded; migrate to Payload blocks only when a human developer decides to.

export { about, callToAction, faqs, news, support } from '@/config/placeholderContent'

// Summit week starts at midnight in Kingston (UTC-5, no daylight saving).
export const summitStart = '2026-11-16T00:00:00-05:00'

export const home = {
  hero: {
    kicker: 'Caribbean Brain Health Summit · 16–22 November 2026',
    heading: 'One Caribbean.\nOne brain health future.',
    lead: 'A week of free sessions across the region and online, and a shared plan for what comes next. Your gift makes it happen.',
    secondary: { label: 'See the week', href: '#week' },
  },
  stats: [
    { value: '7', label: 'days of free activity' },
    { value: '5', label: 'host countries' },
    { value: '1', label: 'Anchor Day in Jamaica' },
    { value: '5', label: 'action areas for policy' },
  ],
  // Source: WHO news release, 14 March 2024 (GBD 2021, The Lancet Neurology).
  statement: {
    text: 'More than 1 in 3 people worldwide live with a condition that affects the brain or nervous system.',
    source: 'World Health Organization, 2024',
  },
  map: {
    kicker: 'Where it happens',
    heading: 'Across the region, and online',
    body: 'Each host country runs its own programme of free, local activity. Online sessions let anyone in the region or the diaspora join in.',
    online: 'Plus online sessions, open to everyone',
  },
  week: {
    kicker: 'Summit week',
    heading: 'Seven days, one region',
    body: 'Local activity runs all week. The Anchor Day takes place in Jamaica.',
  },
  roadmap: {
    kicker: 'The road ahead',
    heading: 'From consultation to policy',
    body: 'The Summit is one step on a longer road. Here’s where we are and what your support carries forward.',
  },
  impact: {
    kicker: 'What your gift does',
    heading: 'Every gift reaches a community',
    body: 'Indicative examples. Every donation goes to the Summit and the work that follows.',
  },
  areas: {
    kicker: 'Caribbean Call to Action on Brain Health',
    heading: 'Five areas for action',
    body: 'A policy statement shaped by communities, practitioners and policymakers. Summit week feeds straight into it.',
    link: 'Read the Call to Action',
  },
  news: { kicker: 'News', heading: 'Latest from the Summit', link: 'All news' },
}

// TODO: placeholder host countries; confirm with Amagi (`host-countries` collection, Release 2).
// x and y are positions on the map's own grid (see caribbeanMap.ts).
export const hostCountries = [
  { name: 'Jamaica', city: 'Kingston', x: 365, y: 285, anchor: true, labelSide: 'left' },
  { name: 'The Bahamas', city: 'Nassau', x: 349, y: 73, anchor: false, labelSide: 'right' },
  { name: 'Barbados', city: 'Bridgetown', x: 858, y: 432, anchor: false, labelSide: 'left' },
  {
    name: 'Trinidad and Tobago',
    city: 'Port of Spain',
    x: 803,
    y: 506,
    anchor: false,
    labelSide: 'left',
  },
  { name: 'Cayman Islands', city: 'George Town', x: 233, y: 246, anchor: false, labelSide: 'left' },
] as const

// TODO: the Anchor Day date comes from the `anchor-day` global once Amagi confirms it.
export const summitWeek = [
  { day: 'Mon', date: '16', label: 'Opening', body: 'Launch events in every host country' },
  { day: 'Tue', date: '17', label: 'Local activity', body: 'Community sessions and screenings' },
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
]

export type Milestone = {
  when: string
  title: string
  body: string
  status: 'done' | 'now' | 'next'
}

export const roadmap: Milestone[] = [
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
]

// 1 workforce/development, 2 infrastructure, 3 care, 4 evidence, 5 accountability
export const actionAreaIcons = [
  'users',
  'landmark',
  'hand-heart',
  'graduation',
  'badge-check',
] as const

export const aboutV1 = {
  flow: {
    kicker: 'How it works',
    heading: 'From one convener to every community',
    steps: [
      {
        title: 'Amagi Health',
        body: 'Convenes the Summit and leads the Call to Action consultation.',
      },
      { title: 'Country leads', body: 'Plan each host country’s week with local partners.' },
      { title: 'Activity hosts', body: 'Run free sessions on the ground and online.' },
      { title: 'Communities', body: 'Take part, share what works and shape what comes next.' },
    ],
  },
}

export const supportV1 = {
  enablesIcons: ['users', 'video', 'hand-heart', 'file-text'] as const,
  safeguardIcons: ['scale', 'badge-check', 'lock', 'file-text'] as const,
}

export const callToActionV1 = {
  wheelCentre: 'Caribbean brain health',
  process: {
    kicker: 'How the consultation works',
    heading: 'Your voice, in four steps',
    steps: [
      { title: 'Read', body: 'Explore the five action areas.', status: 'done' },
      { title: 'Comment', body: 'Tell us what matters where you live.', status: 'now' },
      { title: 'Review', body: 'Amagi reviews every response after Summit week.', status: 'next' },
      { title: 'Publish', body: 'The final Call to Action is shared in 2027.', status: 'next' },
    ] satisfies { title: string; body: string; status: Milestone['status'] }[],
  },
}
