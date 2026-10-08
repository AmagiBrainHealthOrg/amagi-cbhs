import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seedPages } from '@/seed/content'

// Analytics moved from Google Analytics to Plausible, so the privacy and cookies drafts from
// release_1_content change too. A page is replaced only while it still has the Google Analytics
// wording, so editors' changes are kept. A fresh database gets the new copy from `pnpm db:seed`,
// so this does nothing there (SPEC §6.4).
const GOOGLE_WORDING: Record<string, string> = {
  privacy: 'Google Analytics records how the site is used',
  cookies: '_ga_<container ID>',
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const seeded = seedPages({ hero: [] })
  for (const [slug, wording] of Object.entries(GOOGLE_WORDING)) {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      req,
    })
    const page = docs[0]
    if (!page || !JSON.stringify(page.layout).includes(wording)) continue
    const layout = seeded.find((seed) => seed.slug === slug)?.layout
    if (!layout) continue
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { layout, _status: 'published' },
      context: { disableRevalidate: true },
      req,
    })
    payload.logger.info(`plausible_legal_copy: ${slug} copy replaced`)
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('plausible_legal_copy down: content left in place')
}
