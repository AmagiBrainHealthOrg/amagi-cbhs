import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'
import { countriesLink, pladrrLink } from '@/seed/content'
import { hasContent } from '@/seed/hasContent'
import { pladrrFormPage, pladrrPage, pladrrThankYou } from '@/seed/pladrr'

// The PLADRR Jamaica 2027 page at /pladrr (10 November 2026), linked from the footer and from
// the PLADRR step of the roadmap on Home and About, and its expression of interest form at
// /pladrr/express-interest with its thank-you copy. Creates only what is missing, so editors'
// changes are kept. A fresh database gets all of this from `pnpm db:seed`.

type Args = { payload: Payload; req: PayloadRequest }
type Link = { label: string; href: string; id?: string | null }

const context = () => ({ disableRevalidate: true })
const ROADMAP_TITLE = 'PLADRR, Kingston'

async function createPage({ payload, req }: Args, page: typeof pladrrPage) {
  const { totalDocs } = await payload.count({
    collection: 'pages',
    where: { slug: { equals: page.slug } },
    req,
  })
  if (totalDocs > 0) return
  await payload.create({
    collection: 'pages',
    data: { ...page, _status: 'published' },
    context: context(),
    req,
  })
  payload.logger.info(`pladrr_page: created ${page.slug}`)
}

async function thankYou({ payload, req }: Args) {
  const forms = await payload.findGlobal({ slug: 'forms', depth: 0, req })
  const entries = forms.thankYou ?? []
  if (entries.some((entry) => entry.form === pladrrThankYou.form)) return
  await payload.updateGlobal({
    slug: 'forms',
    data: { thankYou: [...entries, pladrrThankYou], _status: 'published' },
    context: context(),
    req,
  })
  payload.logger.info('pladrr_page: thank-you copy added')
}

async function footerLink({ payload, req }: Args) {
  const footer = await payload.findGlobal({ slug: 'footer', depth: 0, req })
  const links = (footer.links ?? []) as Link[]
  if (links.some(({ href }) => href === pladrrLink.href)) return
  const after = links.findIndex(({ href }) => href === countriesLink.href)
  const next = [...links]
  next.splice(after + 1, 0, pladrrLink)
  await payload.updateGlobal({
    slug: 'footer',
    data: { links: next, _status: 'published' },
    context: context(),
    req,
  })
  payload.logger.info('pladrr_page: footer links to /pladrr')
}

async function roadmapLinks({ payload, req }: Args) {
  for (const slug of ['home', 'about']) {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      req,
    })
    const page = docs[0] as Page | undefined
    if (!page) continue
    let changed = false
    const layout = (page.layout ?? []).map((block) => {
      if (block.blockType !== 'roadmap') return block
      return {
        ...block,
        steps: (block.steps ?? []).map((step) => {
          if (step.title !== ROADMAP_TITLE || step.href) return step
          changed = true
          return { ...step, href: '/pladrr' }
        }),
      }
    })
    if (!changed) continue
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { layout, _status: 'published' },
      context: context(),
      req,
    })
    payload.logger.info(`pladrr_page: the ${slug} roadmap links to /pladrr`)
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('pladrr_page: fresh database, content comes from pnpm db:seed')
    return
  }
  const args = { payload, req }
  await createPage(args, pladrrPage)
  await createPage(args, pladrrFormPage)
  await thankYou(args)
  await footerLink(args)
  await roadmapLinks(args)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('pladrr_page down: content left in place')
}
