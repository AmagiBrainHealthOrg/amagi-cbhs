import { Heart } from 'lucide-react'
import React from 'react'

import { getGlobal } from '@/lib/globals'

import { Button } from './Button'

// Copy comes from `donation-settings.banner` (SPEC §6.3), so every banner on the site matches.
export async function DonateBanner({ id = 'donate-banner' }: { id?: string }) {
  const { banner } = await getGlobal('donation-settings')
  if (!banner?.heading || !banner.label) return null

  const titleId = `${id}-title`
  return (
    <section className="v1-donate-band" aria-labelledby={titleId}>
      <div className="v1-donate-band-inner">
        <h2 id={titleId}>{banner.heading}</h2>
        {banner.body && <p>{banner.body}</p>}
        <Button
          href="/donate"
          variant="primary"
          journey="donate"
          action="donate"
          className="v1-donate-button"
        >
          <Heart aria-hidden="true" /> {banner.label}
        </Button>
      </div>
    </section>
  )
}
