import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import { Section } from '@/components/Section'
import { TeamBio } from '@/components/TeamBio'
import config from '@/payload.config'

import type { BlockProps } from './types'

const paragraphs = (text?: string | null) =>
  (text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

export async function TeamBlock({ block, blockId }: BlockProps<'team'>) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'team',
    sort: ['order', 'name'],
    depth: 1,
    pagination: false,
    overrideAccess: false,
  })
  if (docs.length === 0) return null

  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <ul className="v1-team">
        {docs.map(({ id, name, role, country, photo, bio: text }) => {
          const bio = paragraphs(text)
          const image = photo && typeof photo === 'object' && photo.url ? photo : undefined
          const subtitle = [role, country].filter(Boolean).join(' · ')
          return (
            <li key={id} className="v1-team-member">
              {image && (
                <Image
                  src={image.url!}
                  alt=""
                  width={image.width ?? 640}
                  height={image.height ?? 640}
                  sizes="112px"
                />
              )}
              <div>
                <h3>{name}</h3>
                {subtitle && <p className="v1-team-role">{subtitle}</p>}
                {bio.length > 0 && (
                  <TeamBio name={name} subtitle={subtitle || undefined} paragraphs={bio} />
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
