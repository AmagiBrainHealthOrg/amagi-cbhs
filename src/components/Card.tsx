import React from 'react'

import type { IconKey } from '@/config/icons'

import { Button } from './Button'

import { icons } from './graphics/graphics'

export type CardLink = { label?: string | null; href?: string | null } | null

type Props = {
  icon: IconKey
  title?: string | null
  body?: string | null
  link?: CardLink
  index?: number
}

// Lives inside a `.v1-icon-tiles` list; `index` cycles the four brand colours.
export function Card({ icon, title, body, link, index = 0 }: Props) {
  const Icon = icons[icon]
  return (
    <li className={`v1-icon-tile-${index % 4}`}>
      <span>
        <Icon aria-hidden="true" />
      </span>
      {title && <h3>{title}</h3>}
      {body && <p>{body}</p>}
      {link?.label && link.href && (
        <Button href={link.href} variant="tertiary" journey="awareness" action="card_link">
          {link.label}
        </Button>
      )}
    </li>
  )
}
