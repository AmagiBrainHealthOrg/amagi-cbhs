import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { recordingsRegisterLink } from '@/seed/content'
import { hasContent } from '@/seed/hasContent'

// The Summit Week "Can't join live?" card keeps its Register your interest button (15 November
// 2026), so 20261115_190000_sessions_cta is undone for that card: its button points at /register
// again and the /register page is published again. Only a button still as that migration left it
// changes, and only a page still in draft is published. A fresh database gets this from
// `pnpm db:seed`.

type Link = { label?: string | null; href?: string | null }
const leftBySessionsCta = (link: Link) =>
  link.href === '#programme' && link.label === 'Sign up for a session'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('cant_join_live_register: fresh database, content comes from pnpm db:seed')
    return
  }

  const { docs: weeks } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'summit-week' } },
    limit: 1,
    depth: 0,
    req,
  })
  const week = weeks[0]
  if (week) {
    let changed = false
    const layout = (week.layout ?? []).map((block) => {
      if (block.blockType !== 'cardGrid') return block
      if (!block.links?.some(leftBySessionsCta)) return block
      changed = true
      return {
        ...block,
        links: block.links.map((link) =>
          leftBySessionsCta(link) ? { ...link, ...recordingsRegisterLink } : link,
        ),
      }
    })
    if (changed) {
      await payload.update({
        collection: 'pages',
        id: week.id,
        data: { layout, _status: 'published' },
        context: { disableRevalidate: true },
        req,
      })
      payload.logger.info("cant_join_live_register: Can't join live? button points at /register")
    }
  }

  const { docs: registers } = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: 'register' } }, { _status: { equals: 'draft' } }] },
    limit: 1,
    depth: 0,
    req,
  })
  const register = registers[0]
  if (register) {
    await payload.update({
      collection: 'pages',
      id: register.id,
      data: { _status: 'published' },
      context: { disableRevalidate: true },
      req,
    })
    payload.logger.info('cant_join_live_register: /register page published again')
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('cant_join_live_register down: content left in place')
}
