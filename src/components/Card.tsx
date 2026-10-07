import React from 'react'

import type { IconKey } from '@/config/icons'

import { icons } from './graphics/graphics'

type Props = { icon: IconKey; title?: string | null; body?: string | null; index?: number }

// Lives inside a `.v1-icon-tiles` list; `index` cycles the four brand colours.
export function Card({ icon, title, body, index = 0 }: Props) {
  const Icon = icons[icon]
  return (
    <li className={`v1-icon-tile-${index % 4}`}>
      <span>
        <Icon aria-hidden="true" />
      </span>
      {title && <h3>{title}</h3>}
      {body && <p>{body}</p>}
    </li>
  )
}
