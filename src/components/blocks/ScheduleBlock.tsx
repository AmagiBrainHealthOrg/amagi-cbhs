import { getPayload } from 'payload'
import React from 'react'

import { Schedule } from '@/components/Schedule'
import { Section } from '@/components/Section'
import { countryHrefsByLocation } from '@/lib/countries'
import config from '@/payload.config'
import { buildSchedule, type ScheduleData } from '@/utils/schedule'

import { previewUser } from '../../app/(frontend)/(site)/_page'

import type { BlockProps } from './types'

export async function ScheduleBlock({ block, blockId }: BlockProps<'schedule'>) {
  let data: ScheduleData | undefined
  try {
    const payload = await getPayload({ config })
    const user = await previewUser()
    const read = { pagination: false, draft: Boolean(user), overrideAccess: false, user } as const
    const [locations, themes, sessions] = await Promise.all([
      payload.find({ collection: 'session-locations', sort: ['order', 'name'], ...read }),
      payload.find({ collection: 'session-themes', sort: ['order', 'name'], ...read }),
      payload.find({ collection: 'sessions', depth: 0, ...read }),
    ])
    const schedule = buildSchedule(block, locations.docs, themes.docs, sessions.docs)
    const countryHrefs = await countryHrefsByLocation()
    data = {
      ...schedule,
      locations: schedule.locations.map((location) => ({
        ...location,
        countryHref: countryHrefs.get(location.id),
      })),
    }
  } catch (error) {
    console.error('The schedule could not load its sessions', error)
  }

  if (data && data.sessions.length === 0) return null
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      {data ? (
        <Schedule data={data} />
      ) : (
        <p className="form-alert" role="alert">
          The programme is unavailable right now. Please try again later.
        </p>
      )}
    </Section>
  )
}
