import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { countryPagesCopy, createMissingCountries } from '@/seed/countries'
import { hasContent } from '@/seed/hasContent'

// Moves the country pages' copy into the CMS (10 November 2026): one `countries` document per
// host country, linked to its session location, and the shared wording on the Country Pages
// global. Creates only missing countries and fills the global only while it is empty, so
// editors' changes are kept. A fresh database gets both from `pnpm db:seed`.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('country_pages_content: fresh database, content comes from pnpm db:seed')
    return
  }

  for (const label of await createMissingCountries({ payload, req })) {
    payload.logger.info(`country_pages_content: created ${label}`)
  }

  const current = await payload.findGlobal({ slug: 'country-pages', depth: 0, req })
  if (!current.programme?.heading) {
    await payload.updateGlobal({
      slug: 'country-pages',
      data: { ...countryPagesCopy, _status: 'published' },
      context: { disableRevalidate: true },
      req,
    })
    payload.logger.info('country_pages_content: Country Pages global filled')
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('country_pages_content down: content left in place')
}
