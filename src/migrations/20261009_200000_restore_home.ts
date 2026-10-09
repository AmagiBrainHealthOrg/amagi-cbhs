import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

import type { Page } from '@/payload-types'
import snapshot from '@/seed/home-snapshot.json'

// Restores the Home page, deleted from production by accident on 9 October 2026, from the copy
// pulled that morning. A fresh database has no pages yet and gets Home from `pnpm db:seed`, so
// this only runs where other pages exist and Home is missing.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const { rows } = await db.execute(
    sql`select exists(select 1 from pages) as has_pages, exists(select 1 from pages where slug = 'home') as has_home`,
  )
  const { has_pages, has_home } = rows[0] as { has_pages: boolean; has_home: boolean }
  if (!has_pages || has_home) {
    payload.logger.info('restore_home: nothing to restore')
    return
  }

  await payload.create({
    collection: 'pages',
    data: snapshot as Omit<Page, 'id' | 'createdAt' | 'updatedAt'>,
    context: { disableRevalidate: true },
    req,
  })
  payload.logger.info('restore_home: restored Home')
}

export async function down(_args: MigrateDownArgs): Promise<void> {}
