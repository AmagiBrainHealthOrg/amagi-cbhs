import { MapPin, Video } from 'lucide-react'
import React from 'react'

import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function EventsBlock({ block, blockId }: BlockProps<'events'>) {
  const groups = (block.groups ?? []).filter(({ events }) => events && events.length > 0)
  if (!block.show || groups.length === 0) return null
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <ul className="v1-events">
        {groups.map(({ id, name, online, events }) => {
          const Icon = online ? Video : MapPin
          return (
            <li key={id ?? name}>
              <h3>
                <Icon aria-hidden="true" />
                {name}
              </h3>
              <ul>
                {events?.map((event) => (
                  <li key={event.id ?? event.title}>
                    <h4>{event.title}</h4>
                    {event.body && <p>{event.body}</p>}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
