import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'
import { teamMembers, teamSection } from '@/seed/content'
import { hasContent } from '@/seed/hasContent'

// The Summit team with headshots, and a team section on About before its donate banner, for
// databases that already have content. A fresh database gets the people (without photos, as CI
// has no storage) and the section from `pnpm db:seed`. Only what is missing is added.

const MEDIA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../seed/media/team')

type Args = { payload: Payload; req: PayloadRequest }

const context = () => ({ disableRevalidate: true })

// Uploads run outside the migration's transaction, so a stored file always has its media row.
async function upload({ payload, req }: Args, file: string, alt: string) {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: file } },
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

async function people(args: Args) {
  for (const { photoFile, ...member } of teamMembers) {
    const { totalDocs } = await args.payload.count({
      collection: 'team',
      where: { name: { equals: member.name } },
      req: args.req,
    })
    if (totalDocs > 0) continue
    const photo = await upload(args, photoFile, member.name)
    await args.payload.create({
      collection: 'team',
      data: { ...member, photo, _status: 'published' },
      context: context(),
      req: args.req,
    })
    args.payload.logger.info(`team_content: ${member.name} added`)
  }
}

async function aboutSection({ payload, req }: Args) {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'about' } },
    limit: 1,
    depth: 0,
    req,
  })
  const about = docs[0] as Page | undefined
  if (!about) return
  const layout = about.layout ?? []
  if (layout.some((block) => block.blockType === 'team')) return

  const banner = layout.findIndex((block) => block.blockType === 'donateBanner')
  const at = banner < 0 ? layout.length : banner
  await payload.update({
    collection: 'pages',
    id: about.id,
    data: { layout: [...layout.slice(0, at), { ...teamSection }, ...layout.slice(at)] },
    context: context(),
    req,
  })
  payload.logger.info('team_content: team section added to About')
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('team_content: fresh database, content comes from pnpm db:seed')
    return
  }
  await people({ payload, req })
  await aboutSection({ payload, req })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('team_content down: content left in place')
}
