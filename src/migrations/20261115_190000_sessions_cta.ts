import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'
import { FAQ_SESSIONS_ANSWER, sessionsLink } from '@/seed/content'
import { hasContent } from '@/seed/hasContent'

// The Register Interest form is retired (15 November 2026). Its buttons become "Sign up for a
// session", pointing at the Summit Week programme, and the /register page is unpublished. Only
// links still pointing at /register change, and the FAQ answer only while it is the seeded one,
// so editors' changes are kept. A fresh database gets all of this from `pnpm db:seed`.

type Args = { payload: Payload; req: PayloadRequest }
type Link = { label?: string | null; href?: string | null } | null | undefined

const OLD_HREF = '/register'
const OLD_FAQ_ANSWER = "Register your interest and we'll email you when the programme is published."

const context = () => ({ disableRevalidate: true })

const swap = <T extends Link>(link: T, href: string): T =>
  link?.href === OLD_HREF ? { ...link, label: sessionsLink.label, href } : link

function relink(page: Page): Page['layout'] | undefined {
  // On Summit Week itself the button only needs to scroll to the programme.
  const href = page.slug === 'summit-week' ? '#programme' : sessionsLink.href
  let changed = false
  const layout = (page.layout ?? []).map((block) => {
    if (block.blockType === 'hero' && block.secondaryLink?.href === OLD_HREF) {
      changed = true
      return { ...block, secondaryLink: swap(block.secondaryLink, href) }
    }
    if ('links' in block && block.links?.some((link) => link.href === OLD_HREF)) {
      changed = true
      return { ...block, links: block.links.map((link) => swap(link, href)) }
    }
    return block
  })
  return changed ? (layout as Page['layout']) : undefined
}

async function pageLinks({ payload, req }: Args) {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { not_equals: 'register' } },
    pagination: false,
    depth: 0,
    req,
  })
  for (const page of docs) {
    const layout = relink(page)
    if (!layout) continue
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { layout, _status: page._status ?? 'published' },
      context: context(),
      req,
    })
    payload.logger.info(`sessions_cta: ${page.slug} buttons point at the programme`)
  }
}

async function faqAnswer({ payload, req }: Args) {
  const { docs } = await payload.find({
    collection: 'faqs',
    where: { answer: { equals: OLD_FAQ_ANSWER } },
    pagination: false,
    depth: 0,
    req,
  })
  for (const faq of docs) {
    await payload.update({
      collection: 'faqs',
      id: faq.id,
      data: { answer: FAQ_SESSIONS_ANSWER },
      context: context(),
      req,
    })
    payload.logger.info(`sessions_cta: FAQ "${faq.question}" answer updated`)
  }
}

async function unpublishRegister({ payload, req }: Args) {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: 'register' } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 0,
    req,
  })
  const page = docs[0]
  if (!page) return
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { _status: 'draft' },
    context: context(),
    req,
  })
  payload.logger.info('sessions_cta: /register page unpublished')
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('sessions_cta: fresh database, content comes from pnpm db:seed')
    return
  }
  const args = { payload, req }
  await pageLinks(args)
  await faqAnswer(args)
  await unpublishRegister(args)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('sessions_cta down: content left in place')
}
