import { getPayload } from 'payload'
import React from 'react'

import { Button } from '@/components/Button'
import { Section } from '@/components/Section'
import { Teaser } from '@/components/Teaser'
import config from '@/payload.config'

import type { BlockProps } from './types'

export async function NewsTeaserBlock({ block, blockId }: BlockProps<'newsTeaser'>) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'news',
    sort: '-publishedDate',
    limit: block.limit,
    depth: 0,
    overrideAccess: false,
  })

  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      {docs.length > 0 && (
        <ul className="v1-news">
          {docs.map(({ id, slug, title, publishedDate, summary }) => (
            <Teaser
              key={id}
              href={`/news/${slug}`}
              title={title}
              date={publishedDate}
              summary={summary}
            />
          ))}
        </ul>
      )}
      {block.linkLabel && (
        <Button href="/news" variant="tertiary" journey="awareness" action="read_more">
          {block.linkLabel}
        </Button>
      )}
    </Section>
  )
}
