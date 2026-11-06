import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import type { Page } from '@/payload-types'
import { hasContent } from '@/seed/hasContent'

const FAQ_QUESTION = 'What is the Anchor Day? And where is it?'
// The wording production held before this migration, not the original seed wording.
const FAQ_OLD =
  'For the inaugural Caribbean Brain Health Summit, the Anchor Day takes the form of a focused, Jamaica-based leadership conversation convened by Dr Ishtar Govia. It brings together invited participants to examine locally relevant brain-health, care and workforce priorities, the evidence and partnerships needed to address them, and feasible next steps beyond Summit week.\n\nThe discussion connects Jamaica’s circumstances with the wider Caribbean agenda. It complements—not replaces—the public sessions, country-led activities and community participation taking place across the week. Any subsequent projects or commitments will require separate agreement.'
// B7 of Dr Govia's copy of 5 November 2026, word for word.
const FAQ_NEW =
  "For the inaugural Caribbean Brain Health Summit, Anchor Day takes the form of a focused, Jamaica-based leadership conversation convened by Dr Ishtar Govia.\n\nInvited participants will examine locally relevant brain-health, care and workforce priorities, the evidence and partnerships needed to address them, and feasible next steps beyond Summit week.\n\nThe conversation connects Jamaica's circumstances with the wider Caribbean agenda. It complements the public sessions, country-led activities and community participation taking place across the week; it does not represent a regional decision-making or endorsement process. Any subsequent projects or commitments require separate agreement."
const NOTE_OLD = 'Opening'
const NOTE_NEW = 'Summit week begins'

// Each value changes only while it still holds the old text, and anything else is logged, so an
// editor's change is kept. A fresh database gets all of this from `pnpm db:seed`.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('faq_note_relay_layout: fresh database, content comes from pnpm db:seed')
    return
  }

  const updateBlocks = async (
    slug: string,
    change: (block: NonNullable<Page['layout']>[number]) => NonNullable<Page['layout']>[number],
    isChanged: () => boolean,
  ) => {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      req,
    })
    const page = docs[0]
    if (!page) {
      payload.logger.warn(`faq_note_relay_layout: no ${slug} page`)
      return
    }
    const layout = (page.layout ?? []).map(change)
    if (!isChanged()) return
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { layout, _status: 'published' },
      context: { disableRevalidate: true },
      req,
    })
  }

  const { docs: faqs } = await payload.find({
    collection: 'faqs',
    where: { question: { equals: FAQ_QUESTION } },
    limit: 1,
    depth: 0,
    req,
  })
  const faq = faqs[0]
  if (faq?.answer === FAQ_OLD) {
    await payload.update({
      collection: 'faqs',
      id: faq.id,
      data: { answer: FAQ_NEW, _status: 'published' },
      context: { disableRevalidate: true },
      req,
    })
  } else if (faq?.answer !== FAQ_NEW) {
    payload.logger.warn(
      `faq_note_relay_layout: left the Anchor Day FAQ: ${faq ? faq.answer : 'no such FAQ'}`,
    )
  }

  let noteChanged = false
  await updateBlocks(
    'summit-week',
    (block) => {
      if (block.blockType !== 'schedule') return block
      return {
        ...block,
        dayNotes: block.dayNotes?.map((note) => {
          if (!note.day.startsWith('2026-11-16')) return note
          if (note.note === NOTE_OLD) {
            noteChanged = true
            return { ...note, note: NOTE_NEW }
          }
          if (note.note !== NOTE_NEW) {
            payload.logger.warn(`faq_note_relay_layout: left the Monday note: ${note.note}`)
          }
          return note
        }),
      }
    },
    () => noteChanged,
  )

  // Prose centres a narrow column for the legal pages. Split with no heading sits on the same
  // left edge as the Relay hero and form.
  let layoutChanged = false
  await updateBlocks(
    'relay',
    (block) => {
      if (block.blockType !== 'richText') return block
      if (block.layout === 'prose') {
        layoutChanged = true
        return { ...block, layout: 'split' }
      }
      payload.logger.warn(`faq_note_relay_layout: left a Relay text layout: ${block.layout}`)
      return block
    },
    () => layoutChanged,
  )

  payload.logger.info('faq_note_relay_layout: done')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('faq_note_relay_layout down: content left in place')
}
