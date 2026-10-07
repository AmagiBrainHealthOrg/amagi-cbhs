import Image from 'next/image'
import React from 'react'

import type { Media } from '@/payload-types'

export type Logo = {
  id: number
  name: string
  logo?: number | Media | null
  website?: string | null
}

const PLACEHOLDER_SLOTS = 6

// Callers pass only entries with `permissionConfirmed` (CLAUDE.md hard rules).
export function LogoGrid({ logos, emptyText }: { logos: Logo[]; emptyText?: string | null }) {
  if (logos.length === 0) {
    return (
      <>
        <ul className="v1-logo-slots" aria-hidden="true">
          {Array.from({ length: PLACEHOLDER_SLOTS }, (_, index) => (
            <li key={index} />
          ))}
        </ul>
        {emptyText && <p className="v1-muted">{emptyText}</p>}
      </>
    )
  }

  return (
    <ul className="v1-logos">
      {logos.map(({ id, name, logo, website }) => {
        const image = logo && typeof logo === 'object' && logo.url ? logo : undefined
        const content = image ? (
          <Image
            src={image.url!}
            alt={name}
            width={image.width ?? 300}
            height={image.height ?? 200}
            sizes="200px"
          />
        ) : (
          <span>{name}</span>
        )
        return (
          <li key={id}>
            {website ? (
              <a
                href={website}
                rel="noopener"
                data-journey="awareness"
                data-action="outbound"
                data-destination-type="external"
              >
                {content}
              </a>
            ) : (
              content
            )}
          </li>
        )
      })}
    </ul>
  )
}
