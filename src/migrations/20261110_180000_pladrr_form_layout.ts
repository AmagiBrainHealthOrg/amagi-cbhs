import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'
import { hasContent } from '@/seed/hasContent'
import { PLADRR_FORM_SLUG, pladrrPage } from '@/seed/pladrr'

// Layout fixes for the PLADRR pages (10 November 2026). The form page takes the Relay page's
// layout: the blue hero with the wave, and its introduction in body text rather than the large
// lead style. The PLADRR page's three days drop the About page's growing dots. Changes only what
// is still as first published, so editors' changes are kept.

type Args = { payload: Payload; req: PayloadRequest }
type Block = NonNullable<Page['layout']>[number]

async function updateBlocks(
  { payload, req }: Args,
  slug: string,
  change: (block: Block) => Block | undefined,
) {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    req,
  })
  const page = docs[0] as Page | undefined
  if (!page) return
  let changed = false
  const layout = (page.layout ?? []).map((block) => {
    const next = change(block)
    if (!next) return block
    changed = true
    return next
  })
  if (!changed) return
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout, _status: 'published' },
    context: { disableRevalidate: true },
    req,
  })
  payload.logger.info(`pladrr_form_layout: ${slug} updated`)
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('pladrr_form_layout: fresh database, content comes from pnpm db:seed')
    return
  }
  const args = { payload, req }
  await updateBlocks(args, PLADRR_FORM_SLUG, (block) => {
    if (block.blockType === 'hero' && block.style === 'plain') return { ...block, style: 'photo' }
    if (block.blockType === 'richText' && block.layout === 'lead') {
      return { ...block, layout: 'split' }
    }
    return undefined
  })
  await updateBlocks(args, pladrrPage.slug, (block) =>
    block.blockType === 'flow' && block.showDots !== false
      ? { ...block, showDots: false }
      : undefined,
  )
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('pladrr_form_layout down: content left in place')
}
