import { getPayload } from 'payload'
import React from 'react'

import { Button } from '@/components/Button'
import { DonateButton as DonateButtonView } from '@/components/DonateButton'
import { PhotoHero as PhotoHeroView, usableImages } from '@/components/Hero'
import config from '@/payload.config'

export { DonateBanner as DonateBand } from '@/components/DonateBanner'
export { MapHero } from '@/components/Hero'
export { SectionHeading } from '@/components/Section'

// Adapters for the hard-coded pages until T011 rebuilds them from `pages` blocks.
export async function PhotoHero(props: Omit<React.ComponentProps<typeof PhotoHeroView>, 'images'>) {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({ slug: 'coming-soon', depth: 1 })
  return <PhotoHeroView images={usableImages(data.backgroundImages)} {...props} />
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button href={href} variant="tertiary" journey="awareness" action="read_more">
      {children}
    </Button>
  )
}

export function DonateButton() {
  return <DonateButtonView className="v1-donate-button" />
}
