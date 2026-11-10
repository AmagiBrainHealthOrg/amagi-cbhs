import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import type { Page } from '@/payload-types'
import { hasContent } from '@/seed/hasContent'
import { pladrrPage } from '@/seed/pladrr'

// The PLADRR page's long text sections become graphics (10 November 2026): "What is PLADRR?" a
// zoom-out strip, "Why Jamaica" gains a Venn diagram of its three questions, the three days a
// funnel, and "Who the meeting is for" an is/isn't comparison. Each section is replaced only
// while it still holds Ishtar's original text, so an editor's changes are kept.

type Block = NonNullable<Page['layout']>[number]
type Node = { text?: string; children?: Node[] }

const WHO_ORIGINAL = [
  'The scientific working meeting is intended for researchers and relevant policy, practice, community and data-governance contributors whose experience can help address the research questions. Caribbean and Caribbean-diaspora early-career researchers are a priority for meaningful scientific participation and support.',
  'This is not a general conference with automatically available places, an abstract competition or a commercial innovation showcase. Participation arrangements are being finalised. Expressing interest does not confirm attendance, a speaking role or funding.',
  'Early-career participants should contribute to scientific thinking and outputs, not only record discussions. Roles, mentorship, workload, credit and any continuing tasks will be discussed explicitly. Attendance does not automatically commit anyone to twelve months of work.',
].join('\n\n')

const textOf = (node: Node): string => node.text ?? (node.children ?? []).map(textOf).join('')
const paragraphsOf = (content: unknown) =>
  ((content as { root?: Node })?.root?.children ?? []).map(textOf).join('\n\n')
const same = (a?: string | null, b?: string | null) =>
  (a ?? '').replace(/\s+/g, ' ').trim() === (b ?? '').replace(/\s+/g, ' ').trim()

const seeded = <T extends Block['blockType']>(type: T, heading?: string) =>
  pladrrPage.layout!.find(
    (block) =>
      block.blockType === type &&
      (heading === undefined || ('heading' in block && block.heading === heading)),
  ) as Extract<Block, { blockType: T }>

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('pladrr_diagrams: fresh database, content comes from pnpm db:seed')
    return
  }
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: pladrrPage.slug } },
    limit: 1,
    depth: 0,
    req,
  })
  const page = docs[0] as Page | undefined
  if (!page) return

  const scale = seeded('scaleStrip')
  const why = seeded('richText', 'Why Jamaica, and why now?')
  const venn = seeded('venn')
  const funnel = seeded('funnel')
  const comparison = seeded('comparison')

  const replacements = (block: Block): Block[] | undefined => {
    if (block.blockType === 'richText' && block.heading === 'What is PLADRR?') {
      return same(paragraphsOf(block.content), scale.body) ? [scale] : undefined
    }
    if (block.blockType === 'richText' && block.heading === 'Why Jamaica, and why now?') {
      const original = `${paragraphsOf(why.content)}\n\n${venn.body}`
      return same(paragraphsOf(block.content), original) ? [why, venn] : undefined
    }
    if (block.blockType === 'flow' && block.heading === funnel.heading) {
      const steps = block.steps ?? []
      const unchanged =
        same(block.outro, funnel.body) &&
        steps.length === funnel.steps!.length &&
        steps.every(
          (step, index) =>
            same(step.title, funnel.steps![index].title) &&
            same(step.body, funnel.steps![index].body),
        )
      return unchanged ? [funnel] : undefined
    }
    if (block.blockType === 'richText' && block.heading === comparison.heading) {
      return same(paragraphsOf(block.content), WHO_ORIGINAL) ? [comparison] : undefined
    }
    return undefined
  }

  let changed = 0
  const layout = (page.layout ?? []).flatMap((block) => {
    const next = replacements(block)
    if (!next) return [block]
    changed += 1
    return next
  })
  if (changed === 0) return
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout, _status: 'published' },
    context: { disableRevalidate: true },
    req,
  })
  payload.logger.info(`pladrr_diagrams: ${changed} sections now use graphics`)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('pladrr_diagrams down: content left in place')
}
