import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'
import { hasContent } from '@/seed/hasContent'

// Suriname replaces The Bahamas as a host country (2 November 2026). A fresh database gets it from
// `pnpm db:seed` (SPEC §6.4). The Home map is fixed in src/config/hostMap.ts, so it needs nothing
// here. Each step changes only what still holds the seeded Bahamas values, so an editor's changes
// are kept.

type Args = { payload: Payload; req: PayloadRequest }

const OLD_COUNTRY_WEEKS =
  'Activities led by Jamaica, Barbados, Trinidad and Tobago, the Cayman Islands and The Bahamas.'
const NEW_COUNTRY_WEEKS =
  'Activities led by Jamaica, Barbados, Trinidad and Tobago, the Cayman Islands and Suriname.'

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

const save = async ({ payload, req }: Args, page: Page, layout: NonNullable<Page['layout']>) =>
  payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout, _status: 'published' },
    context: { disableRevalidate: true },
    req,
  })

async function countryWeeks(args: Args) {
  const page = await findPage(args, 'summit-week')
  if (!page) return
  let changed = false
  const layout = (page.layout ?? []).map((block) => {
    if (block.blockType !== 'cardGrid') return block
    return {
      ...block,
      items: (block.items ?? []).map((item) => {
        if (item.body !== OLD_COUNTRY_WEEKS) return item
        changed = true
        return { ...item, body: NEW_COUNTRY_WEEKS }
      }),
    }
  })
  if (!changed) return
  await save(args, page, layout)
  args.payload.logger.info('suriname_host_country: Summit Week Country Weeks names Suriname')
}

// Only databases that ran an earlier copy of programme_content have this location.
async function location({ payload, req }: Args) {
  const { docs } = await payload.find({
    collection: 'session-locations',
    where: { and: [{ name: { equals: 'The Bahamas' } }, { city: { equals: 'Nassau' } }] },
    depth: 0,
    req,
  })
  for (const doc of docs) {
    await payload.update({
      collection: 'session-locations',
      id: doc.id,
      data: {
        name: 'Suriname',
        city: 'Paramaribo',
        timeZone: 'America/Paramaribo',
        _status: 'published',
      },
      context: { disableRevalidate: true },
      req,
    })
    payload.logger.info('suriname_host_country: session location renamed to Suriname')
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('suriname_host_country: fresh database, content comes from pnpm db:seed')
    return
  }
  const args = { payload, req }
  await countryWeeks(args)
  await location(args)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('suriname_host_country down: content left in place')
}
