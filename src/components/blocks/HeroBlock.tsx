import React from 'react'

import { Button } from '@/components/Button'
import { DonateButton } from '@/components/DonateButton'
import { Countdown } from '@/components/graphics/Countdown'
import { StatsBand } from '@/components/graphics/graphics'
import { MapHero, PhotoHero, PlainHero, usableImages } from '@/components/Hero'

import type { BlockProps } from './types'

export function HeroBlock({ block }: BlockProps<'hero'>) {
  const {
    style,
    kicker,
    heading,
    lead,
    images,
    showDonateButton,
    secondaryLink,
    extraLink,
    countdown,
    stats,
  } = block
  const links = [
    { link: secondaryLink, action: 'hero_secondary' },
    { link: extraLink, action: 'hero_extra' },
  ].filter(({ link }) => link?.label && link.href)

  const children = (
    <>
      {(showDonateButton || links.length > 0) && (
        <div className="v1-hero-actions">
          {showDonateButton && <DonateButton className="v1-donate-button" />}
          {links.map(({ link, action }) => (
            <Button
              key={action}
              href={link!.href!}
              variant="secondary"
              tone="dark"
              journey="awareness"
              action={action}
            >
              {link!.label}
            </Button>
          ))}
        </div>
      )}
      {countdown?.target && countdown.label && (
        <Countdown target={countdown.target} label={countdown.label} units={countdown.units} />
      )}
    </>
  )
  const statsBand = stats && stats.length > 0 && <StatsBand stats={stats} />
  const props = { kicker, heading, lead, children }

  if (style === 'map') {
    return (
      <div className="v1-fold">
        <MapHero {...props} />
        {statsBand}
      </div>
    )
  }
  return (
    <>
      {style === 'photo' ? (
        <PhotoHero images={usableImages(images)} {...props} />
      ) : (
        <PlainHero {...props} />
      )}
      {statsBand}
    </>
  )
}
