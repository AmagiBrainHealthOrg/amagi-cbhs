import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'
import { hasContent } from '@/seed/hasContent'

// About's "Explore country participation" button goes to the partnership form on /partner, not
// the top of Summit Week (3 November 2026). A fresh database gets both from `pnpm db:seed`. Each
// step changes only what still holds the old value, so an editor's changes are kept.

type Args = { payload: Payload; req: PayloadRequest }

const ANCHOR = 'partner-form'
const LABEL = 'Explore country participation'
const OLD_HREF = '/summit-week'
const NEW_HREF = `/partner#${ANCHOR}`

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

const save = ({ payload, req }: Args, page: Page, layout: NonNullable<Page['layout']>) =>
  payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout, _status: 'published' },
    context: { disableRevalidate: true },
    req,
  })

async function formAnchor(args: Args) {
  const page = await findPage(args, 'partner')
  if (!page) return
  let changed = false
  const layout = (page.layout ?? []).map((block) => {
    if (block.blockType !== 'form' || block.form !== 'partner' || block.anchorId) return block
    changed = true
    return { ...block, anchorId: ANCHOR }
  })
  if (!changed) return
  await save(args, page, layout)
  args.payload.logger.info(`about_partner_link: the partnership form has the #${ANCHOR} anchor`)
}

async function aboutLink(args: Args) {
  const page = await findPage(args, 'about')
  if (!page) return
  let changed = false
  const layout = (page.layout ?? []).map((block) => {
    if (block.blockType !== 'cardGrid') return block
    return {
      ...block,
      links: (block.links ?? []).map((link) => {
        if (link.label !== LABEL || link.href !== OLD_HREF) return link
        changed = true
        return { ...link, href: NEW_HREF }
      }),
    }
  })
  if (!changed) return
  await save(args, page, layout)
  args.payload.logger.info(`about_partner_link: About links to ${NEW_HREF}`)
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('about_partner_link: fresh database, content comes from pnpm db:seed')
    return
  }
  const args = { payload, req }
  await formAnchor(args)
  await aboutLink(args)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('about_partner_link down: content left in place')
}
