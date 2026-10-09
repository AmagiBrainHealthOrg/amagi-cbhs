import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'
import { cookiesContent } from '@/seed/legal'
import { hasContent } from '@/seed/hasContent'

// Brings production's copy in line with Netlify hosting and the retired cookie banner (T015), and
// points Plausible at amagisummit.org. Each change applies only while our own wording is still
// there, so editors' changes are kept. A fresh database gets all of this from `pnpm db:seed`.

type Args = { payload: Payload; req: PayloadRequest }
type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }

const context = () => ({ disableRevalidate: true })

const textOf = (node: LexicalNode): string =>
  node.text ?? (node.children ?? []).map(textOf).join('')

async function editRichText(
  { payload, req }: Args,
  slug: string,
  edit: (root: LexicalNode) => boolean,
) {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    req,
  })
  const page = docs[0] as Page | undefined
  if (!page?.layout) return

  let changed = false
  const layout = page.layout.map((block) => {
    if (block.blockType !== 'richText' || !block.content) return block
    const content = structuredClone(block.content)
    if (!edit(content.root as LexicalNode)) return block
    changed = true
    return { ...block, content }
  })
  if (!changed) return
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout },
    context: context(),
    req,
  })
  payload.logger.info(`hosting_and_cookie_copy: ${slug} updated`)
}

// "Vercel hosts the website." → "Netlify hosts the website."
const netlifyHosting = (root: LexicalNode) => {
  let changed = false
  const visit = (node: LexicalNode) => {
    if (node.text === 'Vercel') {
      node.text = 'Netlify'
      changed = true
    }
    node.children?.forEach(visit)
  }
  visit(root)
  return changed
}

// The "Strictly necessary" section that described the banner's cookie becomes the seed's
// "Cookies" section.
const noConsentCookie = (root: LexicalNode) => {
  const children = root.children ?? []
  const start = children.findIndex(
    (node) => node.type === 'heading' && textOf(node) === 'Strictly necessary',
  )
  const end = children.findIndex(
    (node, index) => index > start && textOf(node).includes('cbhs_consent'),
  )
  if (start < 0 || end < 0) return false

  const seed = (cookiesContent.root as LexicalNode).children ?? []
  const heading = seed.findIndex((node) => node.type === 'heading' && textOf(node) === 'Cookies')
  children.splice(start, end - start + 1, ...structuredClone(seed.slice(heading, heading + 2)))
  return true
}

async function plausibleDomain({ payload, req }: Args) {
  const { plausibleDomain } = await payload.findGlobal({ slug: 'integrations', depth: 0, req })
  if (!plausibleDomain || !/\.(vercel|netlify)\.app$/.test(plausibleDomain)) return
  await payload.updateGlobal({
    slug: 'integrations',
    data: { plausibleDomain: 'amagisummit.org' },
    context: context(),
    req,
  })
  payload.logger.info('hosting_and_cookie_copy: Plausible domain set to amagisummit.org')
}

// An untitled, empty draft left behind while the Home page was being recovered. Raw SQL: Payload
// queries can't match a draft that has neither title nor slug.
async function emptyDrafts({ db, payload, req }: Args & { db: MigrateUpArgs['db'] }) {
  const { rows } = await db.execute(
    sql`select id from pages where title is null and slug is null and not exists (select 1 from pages_blocks_rich_text b where b._parent_id = pages.id) and not exists (select 1 from pages_blocks_hero h where h._parent_id = pages.id)`,
  )
  for (const { id } of rows as { id: number }[]) {
    await payload.delete({ collection: 'pages', id, context: context(), req })
    payload.logger.info(`hosting_and_cookie_copy: empty draft page ${id} deleted`)
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('hosting_and_cookie_copy: fresh database, content comes from pnpm db:seed')
    return
  }
  const args = { payload, req }
  await editRichText(args, 'privacy', netlifyHosting)
  await editRichText(args, 'cookies', noConsentCookie)
  await plausibleDomain(args)
  await emptyDrafts({ ...args, db })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('hosting_and_cookie_copy down: content left in place')
}
