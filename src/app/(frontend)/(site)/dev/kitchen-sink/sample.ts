import type { LayoutBlock } from '@/components/blocks/types'
import type { RichTextBlock } from '@/payload-types'

// Sample data for the dev-only kitchen sink. Not shown to visitors.

const text = (value: string) => ({
  type: 'text',
  text: value,
  version: 1,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
})
const node = (type: string, value: string, extra: Record<string, unknown> = {}) => ({
  type,
  version: 1,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  children: [text(value)],
  ...extra,
})

const lexical = (...children: ReturnType<typeof node>[]): RichTextBlock['content'] => ({
  root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children },
})

const section = { kicker: 'Sample kicker', intro: 'An optional introduction under the heading.' }

const countries = [
  { name: 'Jamaica', city: 'Kingston', x: 365, y: 285, anchor: true, labelSide: 'left' as const },
  { name: 'The Bahamas', city: 'Nassau', x: 349, y: 73, labelSide: 'right' as const },
  { name: 'Barbados', city: 'Bridgetown', x: 858, y: 432, labelSide: 'left' as const },
]

export const sampleBlocks: LayoutBlock[] = [
  {
    blockType: 'hero',
    id: 'hero',
    style: 'map',
    kicker: 'Hero · map style',
    heading: 'One Caribbean.\nA sample heading.',
    lead: 'The hero lead sits under the heading.',
    showDonateButton: true,
    secondaryLink: { label: 'Secondary link', href: '#summit-week' },
    countdown: { target: '2026-11-16T05:00:00.000Z', label: 'Counting down to' },
    stats: [
      { value: '7', label: 'sample days' },
      { value: '5', label: 'sample countries' },
    ],
  },
  {
    blockType: 'statement',
    id: 'statement',
    text: 'A key statement in the display face.',
    source: 'Sample source, 2026',
  },
  {
    blockType: 'richText',
    id: 'rich-split',
    ...section,
    heading: 'Rich text · split',
    background: 'white',
    layout: 'split',
    content: lexical(
      node('paragraph', 'Split layout: the heading sits beside the text on wide screens.'),
    ),
  },
  {
    blockType: 'richText',
    id: 'rich-prose',
    heading: 'Rich text · prose',
    background: 'white',
    layout: 'prose',
    content: lexical(
      node('heading', 'A prose subheading', { tag: 'h3' }),
      node('paragraph', 'Prose layout is the reading column used for legal pages.'),
    ),
  },
  {
    blockType: 'hostMap',
    id: 'host-map',
    ...section,
    heading: 'Host map',
    background: 'blue',
    onlineLabel: 'Plus sample online sessions',
    countries,
  },
  {
    blockType: 'summitWeek',
    id: 'summit-week',
    ...section,
    heading: 'Summit week',
    background: 'white',
    anchorId: 'summit-week',
    days: [
      { day: 'Mon', date: '16', label: 'Opening', body: 'Sample opening day' },
      { day: 'Tue', date: '17', label: 'Anchor Day', body: 'Sample anchor day', anchor: true },
      { day: 'Wed', date: '18', label: 'Close', body: 'Sample closing day' },
    ],
  },
  {
    blockType: 'roadmap',
    id: 'roadmap',
    ...section,
    heading: 'Roadmap',
    background: 'pale',
    numbered: false,
    steps: [
      { when: 'Sep 2026', title: 'Done step', body: 'Already happened.', status: 'done' },
      { when: 'Oct 2026', title: 'Current step', body: 'Happening now.', status: 'now' },
      { when: 'Nov 2026', title: 'Next step', body: 'Coming up.', status: 'next' },
    ],
  },
  {
    blockType: 'roadmap',
    id: 'roadmap-numbered',
    heading: 'Roadmap · numbered',
    background: 'white',
    numbered: true,
    steps: [
      { title: 'Read', body: 'First step.', status: 'done' },
      { title: 'Comment', body: 'Second step.', status: 'now' },
      { title: 'Publish', body: 'Third step.', status: 'next' },
    ],
  },
  {
    blockType: 'flow',
    id: 'flow',
    ...section,
    heading: 'Flow',
    background: 'pale',
    steps: [
      { title: 'Convener', body: 'First in the chain.' },
      { title: 'Country leads', body: 'Second in the chain.' },
      { title: 'Activity hosts', body: 'Third in the chain.' },
      { title: 'Communities', body: 'Last in the chain.' },
    ],
  },
  {
    blockType: 'cardGrid',
    id: 'cards-tiles',
    ...section,
    heading: 'Card grid · tiles',
    background: 'white',
    style: 'tiles',
    items: [
      { icon: 'users', title: 'Tile one', body: 'Sample tile body.' },
      { icon: 'video', title: 'Tile two', body: 'Sample tile body.' },
      { icon: 'hand-heart', title: 'Tile three', body: 'Sample tile body.' },
    ],
  },
  {
    blockType: 'cardGrid',
    id: 'cards-badges',
    heading: 'Card grid · badges',
    background: 'blue',
    style: 'badges',
    items: [
      { icon: 'scale', body: 'Sample badge text.' },
      { icon: 'badge-check', body: 'Sample badge text.' },
      { icon: 'lock', body: 'Sample badge text.' },
    ],
  },
  {
    blockType: 'actionAreas',
    id: 'action-areas',
    ...section,
    heading: 'Action areas',
    background: 'white',
    centreLabel: 'Sample centre',
    areas: [
      { icon: 'users', title: 'Area one', body: 'Sample area.' },
      { icon: 'landmark', title: 'Area two', body: 'Sample area.' },
      { icon: 'hand-heart', title: 'Area three', body: 'Sample area.' },
      { icon: 'graduation', title: 'Area four', body: 'Sample area.' },
      { icon: 'badge-check', title: 'Area five', body: 'Sample area.' },
    ],
    link: { label: 'Sample link', href: '/call-to-action' },
  },
  {
    blockType: 'supporterLevels',
    id: 'supporter-levels',
    ...section,
    heading: 'Supporter levels',
    background: 'white',
    levels: [
      { name: 'Level one', body: 'Sample level.' },
      { name: 'Level two', body: 'Sample level.' },
      { name: 'Level three', body: 'Sample level.' },
      { name: 'Level four', body: 'Sample level.' },
    ],
  },
  {
    blockType: 'logoGrid',
    id: 'logo-grid',
    heading: 'Logo grid · supporters from the CMS',
    background: 'white',
    source: 'supporters',
    emptyText: 'Shown when no supporter has confirmed permission yet.',
  },
  {
    blockType: 'faqList',
    id: 'faq-list',
    heading: 'FAQ list from the CMS',
    background: 'pale',
    showCategories: true,
  },
  {
    blockType: 'newsTeaser',
    id: 'news-teaser',
    heading: 'News teaser from the CMS',
    background: 'white',
    limit: 3,
    linkLabel: 'All news',
  },
  { blockType: 'donateBanner', id: 'donate-banner' },
  {
    blockType: 'form',
    id: 'form',
    heading: 'Form placeholder',
    intro: 'The form system arrives in T012.',
    background: 'white',
    form: 'register-interest',
  },
  {
    blockType: 'anchorDay',
    id: 'anchor-day',
    ...section,
    heading: 'Anchor Day from the CMS',
    background: 'pale',
  },
]
