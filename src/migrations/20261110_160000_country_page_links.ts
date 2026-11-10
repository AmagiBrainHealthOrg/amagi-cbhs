import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'
import { hasContent } from '@/seed/hasContent'

// The country pages' buttons go where the developer handover says (10 November 2026): the
// country's programme tab, the Partner and Relay forms with the country filled in, and the
// consultation form, which gets a #have-your-say anchor. Only links still at their first value
// change, so editors' changes are kept. A fresh database gets all of this from `pnpm db:seed`.

type Args = { payload: Payload; req: PayloadRequest }

const ANCHOR = 'have-your-say'

const LINKS: Record<string, string> = {
  '#programme': '/summit-week?country={slug}#programme',
  '/register': '/partner?country={slug}#partner-form',
  '/relay': '/relay?country={slug}',
  '/call-to-action': `/call-to-action#${ANCHOR}`,
}

async function cardLinks({ payload, req }: Args) {
  const global = await payload.findGlobal({ slug: 'country-pages', depth: 0, req })
  const cards = global.takePart?.cards ?? []
  let changed = false
  const next = cards.map((card) => {
    const href = card.linkHref ? LINKS[card.linkHref] : undefined
    if (!href) return card
    changed = true
    return { ...card, linkHref: href }
  })
  if (!changed) return
  await payload.updateGlobal({
    slug: 'country-pages',
    data: { takePart: { ...global.takePart, cards: next }, _status: 'published' },
    context: { disableRevalidate: true },
    req,
  })
  payload.logger.info('country_page_links: Country Pages buttons updated')
}

async function consultationAnchor({ payload, req }: Args) {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'call-to-action' } },
    limit: 1,
    depth: 0,
    req,
  })
  const page = docs[0] as Page | undefined
  if (!page) return
  let changed = false
  const layout = (page.layout ?? []).map((block) => {
    if (block.blockType !== 'form' || block.form !== 'cta-consultation' || block.anchorId) {
      return block
    }
    changed = true
    return { ...block, anchorId: ANCHOR }
  })
  if (!changed) return
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout, _status: 'published' },
    context: { disableRevalidate: true },
    req,
  })
  payload.logger.info(`country_page_links: the consultation form has the #${ANCHOR} anchor`)
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('country_page_links: fresh database, content comes from pnpm db:seed')
    return
  }
  const args = { payload, req }
  await cardLinks(args)
  await consultationAnchor(args)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('country_page_links down: content left in place')
}
