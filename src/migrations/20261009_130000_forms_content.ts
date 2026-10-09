import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'
import { formPages } from '@/seed/content'
import { findImages } from '@/seed/index'

// The form pages (SPEC §8.3) for databases that already have content. A fresh database has no
// Home page yet and gets them from `pnpm db:seed`, so this does nothing there (SPEC §6.4). Each
// step fills only what is missing or still placeholder, so editors' changes are kept.

const GOOGLE_FORM = 'https://docs.google.com/forms/'
const CONSULTATION_PLACEHOLDER = 'The consultation form will open here.'

type Args = { payload: Payload; req: PayloadRequest }

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

async function createFormPages(args: Args) {
  const pages = formPages(await findImages(args))
  for (const page of pages) {
    if (await findPage(args, page.slug)) continue
    await args.payload.create({
      collection: 'pages',
      data: { ...page, _status: 'published' },
      context: context(),
      req: args.req,
    })
    args.payload.logger.info(`forms_content: page ${page.slug} created`)
  }
}

// The hero's "Register interest" link pointed at the Google Form until the site had its own.
async function homeRegisterLink(args: Args, home: Page) {
  const layout = home.layout ?? []
  const hero = layout.find((block) => block.blockType === 'hero')
  if (!hero?.secondaryLink?.href?.startsWith(GOOGLE_FORM)) return
  await args.payload.update({
    collection: 'pages',
    id: home.id,
    data: {
      layout: layout.map((block) =>
        block === hero
          ? { ...hero, secondaryLink: { ...hero.secondaryLink, href: '/register' } }
          : block,
      ),
      _status: 'published',
    },
    context: context(),
    req: args.req,
  })
  args.payload.logger.info('forms_content: Home register link points at /register')
}

async function consultationIntro(args: Args) {
  const page = await findPage(args, 'call-to-action')
  const layout = page?.layout ?? []
  const form = layout.find((block) => block.blockType === 'form')
  if (!page || !form?.intro?.includes(CONSULTATION_PLACEHOLDER)) return
  await args.payload.update({
    collection: 'pages',
    id: page.id,
    data: {
      layout: layout.map((block) =>
        block === form
          ? { ...form, intro: 'Help shape the Caribbean Call to Action on Brain Health.' }
          : block,
      ),
      _status: 'published',
    },
    context: context(),
    req: args.req,
  })
  args.payload.logger.info('forms_content: consultation form intro replaced')
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const args = { payload, req }
  const home = await findPage(args, 'home')
  if (!home) {
    payload.logger.info('forms_content: fresh database, content comes from pnpm db:seed')
    return
  }
  await createFormPages(args)
  await homeRegisterLink(args, home)
  await consultationIntro(args)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('forms_content down: content left in place')
}
