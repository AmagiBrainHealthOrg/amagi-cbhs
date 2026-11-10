import React from 'react'

import { CaribbeanMap } from '@/components/graphics/graphics'
import { Section } from '@/components/Section'
import { hostMap } from '@/config/hostMap'
import { countryHref, getCountries } from '@/lib/countries'

import type { BlockProps } from './types'

// Each country in the list links to its country page, matched by name.
async function countryLinks(): Promise<Map<string, string>> {
  try {
    const countries = await getCountries()
    return new Map(countries.map(({ name, slug }) => [name, countryHref(slug)]))
  } catch (error) {
    console.error('The host map could not load the country pages', error)
    return new Map()
  }
}

export async function HostMapBlock({ block, blockId }: BlockProps<'hostMap'>) {
  const links = await countryLinks()
  return (
    <Section {...block} blockId={blockId} className="v1-split">
      <CaribbeanMap
        countries={hostMap.countries.map((country) => ({
          ...country,
          href: links.get(country.name),
        }))}
        online={hostMap.onlineLabel}
      />
    </Section>
  )
}
