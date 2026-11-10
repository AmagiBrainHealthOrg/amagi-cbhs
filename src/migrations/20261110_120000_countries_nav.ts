import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { countriesLink, summitWeekNav } from '@/seed/content'
import { hasContent } from '@/seed/hasContent'

// Adds "Countries" to the header (after Summit Week) and the start of the footer links, for the
// new country pages (10 November 2026). Skipped where an editor already links to /countries.

const context = () => ({ disableRevalidate: true })

type Link = { label: string; href: string; id?: string | null }

const hasCountries = (links: Link[]) => links.some(({ href }) => href === countriesLink.href)

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('countries_nav: fresh database, content comes from pnpm db:seed')
    return
  }

  const header = await payload.findGlobal({ slug: 'header', depth: 0, req })
  const navItems = (header.navItems ?? []) as Link[]
  if (!hasCountries(navItems)) {
    const after = navItems.findIndex(({ href }) => href === summitWeekNav.href)
    const next = [...navItems]
    next.splice(after + 1, 0, countriesLink)
    await payload.updateGlobal({
      slug: 'header',
      data: { navItems: next, _status: 'published' },
      context: context(),
      req,
    })
    payload.logger.info('countries_nav: header links to /countries')
  }

  const footer = await payload.findGlobal({ slug: 'footer', depth: 0, req })
  const links = (footer.links ?? []) as Link[]
  if (!hasCountries(links)) {
    await payload.updateGlobal({
      slug: 'footer',
      data: { links: [countriesLink, ...links], _status: 'published' },
      context: context(),
      req,
    })
    payload.logger.info('countries_nav: footer links to /countries')
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('countries_nav down: content left in place')
}
