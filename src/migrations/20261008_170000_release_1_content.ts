import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'
import { partnerBanner, partnerLogos, seedPages } from '@/seed/content'
import { hasContent } from '@/seed/hasContent'

// Release 1 polish content for databases that already have content (production and pulled
// copies): the CBHS 2026 header logo, the partners with their logos, the Home partner banner and
// the draft legal copy. A fresh database has no Home page yet and gets all of this from
// `pnpm db:seed`, so this does nothing there and never writes through a later config (SPEC §6.4).
// Each step fills only what is missing or still placeholder, so editors' changes are kept.

const MEDIA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../seed/media')
const LOGO_FILE = 'cbhs-2026-logo.webp'
const LOGO_ALT = 'Amagi Caribbean Brain Health Summit 2026'
const LEGAL_SLUGS = ['privacy', 'cookies', 'terms']
const PLACEHOLDER = 'Amagi will supply the final wording'

type Args = { payload: Payload; req: PayloadRequest }

// A fresh object per call: the storage plugin sets flags on the context, which would leak into
// later uploads if it were shared.
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

// Uploads run outside the migration's transaction, so a stored file always has its media row.
async function upload({ payload, req }: Args, file: string, alt: string) {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: path.basename(file) } },
    limit: 1,
    depth: 0,
    req,
  })
  if (existing.docs[0]) return existing.docs[0].id
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(MEDIA_DIR, file),
    context: context(),
  })
  return media.id
}

async function headerLogo(args: Args) {
  const header = await args.payload.findGlobal({ slug: 'header', depth: 1, req: args.req })
  const current = typeof header.logo === 'object' ? header.logo?.filename : undefined
  if (current === LOGO_FILE) return
  const logo = await upload(args, LOGO_FILE, LOGO_ALT)
  await args.payload.updateGlobal({
    slug: 'header',
    data: { logo, _status: 'published' },
    context: context(),
    req: args.req,
  })
  args.payload.logger.info('release_1_content: header logo set')
}

async function partners(args: Args) {
  for (const { name, file } of partnerLogos) {
    const { totalDocs } = await args.payload.count({
      collection: 'partners',
      where: { name: { equals: name } },
      req: args.req,
    })
    if (totalDocs > 0) continue
    const logo = await upload(args, `partners/${file}`, name)
    await args.payload.create({
      collection: 'partners',
      data: { name, logo, permissionConfirmed: true, _status: 'published' },
      context: context(),
      req: args.req,
    })
    args.payload.logger.info(`release_1_content: partner ${name} created`)
  }
}

async function homeBanner(args: Args, home: Page) {
  const layout = home.layout ?? []
  const hasBanner = layout.some(
    (block) => block.blockType === 'logoGrid' && block.source === 'partners',
  )
  if (hasBanner) return
  const heroIndex = layout.findIndex((block) => block.blockType === 'hero')
  const at = heroIndex + 1
  await args.payload.update({
    collection: 'pages',
    id: home.id,
    data: {
      layout: [...layout.slice(0, at), partnerBanner, ...layout.slice(at)],
      _status: 'published',
    },
    context: context(),
    req: args.req,
  })
  args.payload.logger.info('release_1_content: partner banner added to Home')
}

// Replaces a legal page only while its hero still carries the T011 placeholder lead.
async function legalPages(args: Args) {
  const seeded = seedPages({ hero: [] })
  for (const slug of LEGAL_SLUGS) {
    const page = await findPage(args, slug)
    const hero = page?.layout?.find((block) => block.blockType === 'hero')
    if (!page || !hero?.lead?.includes(PLACEHOLDER)) continue
    const layout = seeded.find((seed) => seed.slug === slug)?.layout
    if (!layout) continue
    await args.payload.update({
      collection: 'pages',
      id: page.id,
      data: { layout, _status: 'published' },
      context: context(),
      req: args.req,
    })
    args.payload.logger.info(`release_1_content: ${slug} copy replaced`)
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const args = { payload, req }
  const home = (await hasContent(db)) ? await findPage(args, 'home') : undefined
  if (!home) {
    payload.logger.info('release_1_content: fresh database, content comes from pnpm db:seed')
    return
  }
  await headerLogo(args)
  await partners(args)
  await homeBanner(args, home)
  await legalPages(args)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('release_1_content down: content left in place')
}
