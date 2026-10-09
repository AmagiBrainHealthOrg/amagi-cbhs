import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'
import {
  aboutContact,
  partnerLink,
  registerLink,
  summitWeekNav,
  summitWeekPage,
} from '@/seed/content'
import { hasContent } from '@/seed/hasContent'
import { findImages } from '@/seed/index'

// The Summit Week page and the buttons that lead to the forms, for databases that already have
// content. A fresh database gets them from `pnpm db:seed`, so this does nothing there (SPEC §6.4).
// Each step fills only what is missing, so editors' changes are kept.

type Args = { payload: Payload; req: PayloadRequest }
type Link = { label: string; href: string }

const context = () => ({ disableRevalidate: true })

const findPage = async ({ payload, req }: Args, slug: string) => {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    req,
  })
  return docs[0] as Page | undefined
}

const savePage = async (
  args: Args,
  page: Page,
  layout: NonNullable<Page['layout']>,
  note: string,
) => {
  await args.payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout, _status: 'published' },
    context: context(),
    req: args.req,
  })
  args.payload.logger.info(`summit_week_content: ${note}`)
}

// Sets a hero link only while it is empty.
async function heroLink(
  args: Args,
  slug: string,
  field: 'secondaryLink' | 'extraLink',
  link: Link,
) {
  const page = await findPage(args, slug)
  const layout = page?.layout ?? []
  const hero = layout.find((block) => block.blockType === 'hero')
  if (!page || !hero || hero[field]?.href) return
  const updated = layout.map((block) => (block === hero ? { ...hero, [field]: link } : block))
  await savePage(args, page, updated, `${slug} hero ${field} set`)
}

async function aboutContactSection(args: Args) {
  const page = await findPage(args, 'about')
  const layout = page?.layout ?? []
  if (!page || layout.some((block) => 'heading' in block && block.heading === aboutContact.heading))
    return
  const banner = layout.findIndex((block) => block.blockType === 'donateBanner')
  const at = banner === -1 ? layout.length : banner
  const block = { ...aboutContact, items: [], links: [...aboutContact.links] }
  await savePage(
    args,
    page,
    [...layout.slice(0, at), block, ...layout.slice(at)],
    'About contact section added',
  )
}

async function createSummitWeek(args: Args) {
  if (await findPage(args, 'summit-week')) return
  await args.payload.create({
    collection: 'pages',
    data: { ...summitWeekPage(await findImages(args)), _status: 'published' },
    context: context(),
    req: args.req,
  })
  args.payload.logger.info('summit_week_content: page summit-week created')
}

async function headerNav({ payload, req }: Args) {
  const header = await payload.findGlobal({ slug: 'header', depth: 0, req })
  const items = header.navItems ?? []
  if (items.some((item) => item.href === summitWeekNav.href)) return
  const about = items.findIndex((item) => item.href === '/about')
  const at = about + 1
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [...items.slice(0, at), summitWeekNav, ...items.slice(at)],
      _status: 'published',
    },
    context: context(),
    req,
  })
  payload.logger.info('summit_week_content: Summit Week added to the header')
}

// The footer's Contact link was a placeholder mailto until the contact form existed.
async function footerContact({ payload, req }: Args) {
  const footer = await payload.findGlobal({ slug: 'footer', depth: 0, req })
  const links = footer.links ?? []
  if (!links.some((link) => link.label === 'Contact' && link.href?.startsWith('mailto:'))) return
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      links: links.map((link) =>
        link.label === 'Contact' && link.href?.startsWith('mailto:')
          ? { ...link, href: '/contact' }
          : link,
      ),
      _status: 'published',
    },
    context: context(),
    req,
  })
  payload.logger.info('summit_week_content: footer Contact points at /contact')
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const args = { payload, req }
  if (!(await hasContent(db))) {
    payload.logger.info('summit_week_content: fresh database, content comes from pnpm db:seed')
    return
  }
  await createSummitWeek(args)
  await headerNav(args)
  await footerContact(args)
  await heroLink(args, 'home', 'extraLink', partnerLink)
  await heroLink(args, 'support', 'secondaryLink', partnerLink)
  await heroLink(args, 'faqs', 'secondaryLink', registerLink)
  await aboutContactSection(args)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('summit_week_content down: content left in place')
}
