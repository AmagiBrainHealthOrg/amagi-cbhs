import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import type { Page } from '@/payload-types'
import { hasContent } from '@/seed/hasContent'
import { anchorDayCopy, relayCopy } from '@/seed/relayAnchorCopy'

const B1 =
  'Convened in Jamaica, a focused leadership conversation on local brain-health priorities, care capacity and practical next steps within the wider Caribbean agenda. Participation by invitation; arrangements shared directly with participants.'
const B5 =
  'Locally led activities and online conversations take place throughout the week. A separate, invitation-only leadership conversation in Jamaica forms the inaugural Anchor Day.'
const OLD_RELAY_TITLE = 'Propose a Brain Health Relay activity'
const OLD_RELAY_LINK = 'Host a Relay hour'
const NEW_RELAY_LINK = 'Propose a Relay activity'

// Dr Govia's Relay and Anchor Day copy of 5 November 2026. A value changes only while it still
// holds the old text, and anything else is logged, so an editor's change is kept. A fresh
// database gets this from `pnpm db:seed`.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasContent(db))) {
    payload.logger.info('relay_and_anchor_day_copy: fresh database, content comes from db:seed')
    return
  }

  const swap = <T extends string | null | undefined>(
    where: string,
    current: T,
    from: string,
    to: string,
  ): T | string => {
    if (current === from) return to
    if (current !== to) payload.logger.warn(`relay_and_anchor_day_copy: left ${where}: ${current}`)
    return current
  }

  const updatePage = async (slug: string, change: (page: Page) => Partial<Page>) => {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      req,
    })
    const page = docs[0]
    if (!page) {
      payload.logger.warn(`relay_and_anchor_day_copy: no ${slug} page`)
      return
    }
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { ...change(page), _status: 'published' },
      context: { disableRevalidate: true },
      req,
    })
  }

  await updatePage('home', (page) => ({
    layout: (page.layout ?? []).map((block) => {
      if (block.blockType === 'hero') {
        return {
          ...block,
          lead: swap(
            'Home hero lead',
            block.lead,
            'A week of free sessions across the region and online, and a shared plan for what comes next. Your gift makes it happen.',
            'A week of free sessions across the region and online, connecting local priorities with practical next steps beyond the week. Your gift makes it happen.',
          ),
        }
      }
      if (block.blockType === 'summitWeek') {
        return {
          ...block,
          intro: swap(
            'Home week intro',
            block.intro,
            'Local activity runs all week. The Anchor Day takes place in Jamaica.',
            B5,
          ),
        }
      }
      return block
    }),
  }))

  await updatePage('summit-week', (page) => {
    const layout: NonNullable<Page['layout']> = []
    for (const block of page.layout ?? []) {
      if (block.blockType === 'hero') {
        layout.push({
          ...block,
          lead: swap(
            'Summit Week hero lead',
            block.lead,
            'Locally led activities across the Caribbean and the diaspora, connected online and brought together at an Anchor Day in Jamaica. Free to attend.',
            B5,
          ),
        })
      } else if (block.blockType === 'flow') {
        layout.push({
          ...block,
          steps: block.steps?.map((step) =>
            step.title === 'Anchor Day'
              ? {
                  ...step,
                  body: swap(
                    'How the week works, Anchor Day',
                    step.body,
                    'Turns what the region said into next steps for 2027 and beyond.',
                    'Brings invited leaders together in Jamaica to explore local priorities and practical next steps within the wider Caribbean agenda.',
                  ),
                }
              : step,
          ),
        })
      } else if (block.blockType === 'cardGrid') {
        layout.push({
          ...block,
          items: block.items?.map((item) => ({
            ...item,
            body:
              item.title === 'Anchor Day'
                ? swap(
                    'Four ways, Anchor Day',
                    item.body,
                    'Families, carers, clinicians, employers and policymakers in one conversation in Jamaica. Date and venue to be announced.',
                    B1,
                  )
                : item.body,
            link:
              item.link?.href === '/relay'
                ? {
                    ...item.link,
                    label: swap(
                      'Relay card button',
                      item.link.label,
                      OLD_RELAY_LINK,
                      NEW_RELAY_LINK,
                    ),
                  }
                : item.link,
          })),
          links: block.links?.map((link) =>
            link.href === '/relay'
              ? {
                  ...link,
                  label: swap('Relay button', link.label, OLD_RELAY_LINK, NEW_RELAY_LINK) as string,
                }
              : link,
          ),
        })
        const alreadyAdded = (page.layout ?? []).some(
          (b) => b.blockType === 'richText' && b.heading === anchorDayCopy.heading,
        )
        if (block.heading === 'Four ways the week comes together' && !alreadyAdded) {
          layout.push({
            blockType: 'richText',
            heading: anchorDayCopy.heading,
            background: 'white',
            layout: 'split',
            content: anchorDayCopy.content,
          })
        }
      } else {
        layout.push(block)
      }
    }
    return { layout }
  })

  await updatePage('relay', (page) => {
    const layout: NonNullable<Page['layout']> = []
    const hasCopy = (page.layout ?? []).some((b) => b.blockType === 'richText')
    for (const block of page.layout ?? []) {
      if (block.blockType === 'hero') {
        layout.push({
          ...block,
          heading: swap(
            'Relay hero heading',
            block.heading,
            OLD_RELAY_TITLE,
            relayCopy.title,
          ) as string,
          lead: swap(
            'Relay hero lead',
            block.lead,
            'Run an activity in your community during Summit week. Your country lead will be in touch.',
            relayCopy.lead,
          ),
        })
      } else if (block.blockType === 'form' && !hasCopy) {
        const prose = { blockType: 'richText', background: 'white', layout: 'prose' } as const
        layout.push({ ...prose, content: relayCopy.intro }, block, {
          ...prose,
          content: relayCopy.after,
        })
      } else {
        layout.push(block)
      }
    }
    return {
      title: swap('Relay page title', page.title, OLD_RELAY_TITLE, relayCopy.title),
      meta: {
        ...page.meta,
        title: swap(
          'Relay meta title',
          page.meta?.title,
          `${OLD_RELAY_TITLE} | Caribbean Brain Health Summit`,
          `${relayCopy.title} | Caribbean Brain Health Summit`,
        ),
      },
      layout,
    }
  })

  const week = await payload.findGlobal({ slug: 'summit-week', depth: 0, req })
  await payload.updateGlobal({
    slug: 'summit-week',
    data: {
      _status: 'published',
      days: (week.days ?? []).map((day) => {
        if (day.day.startsWith('2026-11-16')) {
          return {
            ...day,
            label: swap('Monday label', day.label, 'Anchor Day', 'Summit week begins'),
            body: swap(
              'Monday description',
              day.body,
              'The Summit opens and the Relay begins',
              'Locally led activities and online conversations begin. Check individual listings for dates and access arrangements.',
            ),
          }
        }
        if (day.day.startsWith('2026-11-22')) {
          return {
            ...day,
            body: swap(
              'Sunday description',
              day.body,
              'What was agreed, and what comes next',
              'Reflections from the week and opportunities to continue the work.',
            ),
          }
        }
        return day
      }),
    },
    context: { disableRevalidate: true },
    req,
  })

  // The date only highlights a day on the week strip, and Monday is no longer Anchor Day.
  const anchorDay = await payload.findGlobal({ slug: 'anchor-day', depth: 0, req })
  if (anchorDay.date?.startsWith('2026-11-16')) {
    await payload.updateGlobal({
      slug: 'anchor-day',
      data: { date: null, _status: 'published' },
      context: { disableRevalidate: true },
      req,
    })
  }

  const forms = await payload.findGlobal({ slug: 'forms', depth: 0, req })
  await payload.updateGlobal({
    slug: 'forms',
    data: {
      _status: 'published',
      thankYou: (forms.thankYou ?? []).map((entry) =>
        entry.form !== 'relay'
          ? entry
          : {
              ...entry,
              heading: swap(
                'Relay thank-you heading',
                entry.heading,
                'Thank you for proposing an activity',
                'Thank you. We have received your Brain Health Relay activity proposal.',
              ) as string,
              body: swap(
                'Relay thank-you body',
                entry.body,
                'Your country lead will be in touch about your Brain Health Relay activity.',
                'This acknowledgement does not confirm a programme slot or any requested support. The Summit team or relevant country lead will follow up to clarify the activity, timing and delivery arrangements.\n\nPlease do not advertise the activity as a confirmed Summit contribution until those arrangements have been agreed.',
              ),
            },
      ),
    },
    context: { disableRevalidate: true },
    req,
  })

  const question = 'Can I register to attend Anchor Day?'
  const { totalDocs } = await payload.count({
    collection: 'faqs',
    where: { question: { equals: question } },
    req,
  })
  if (totalDocs === 0) {
    await payload.create({
      collection: 'faqs',
      data: {
        question,
        answer:
          'Anchor Day is an invitation-only leadership conversation in Jamaica. Participation and practical arrangements are coordinated directly with invited participants.\n\nYou can take part in the wider Summit through the [online sessions](/summit-week#programme), appropriate [local activities](/summit-week#programme), the [Brain Health Relay](/relay) and the [Caribbean Call to Action on Brain Health consultation](/call-to-action). Please check individual activity listings for registration and access arrangements.',
        category: 'About the Summit',
        order: 3,
        _status: 'published',
      },
      context: { disableRevalidate: true },
      req,
    })
  }
  payload.logger.info('relay_and_anchor_day_copy: done')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('relay_and_anchor_day_copy down: content left in place')
}
