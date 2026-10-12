import React from 'react'

import { Button } from '@/components/Button'
import { DonateButton } from '@/components/DonateButton'
import { Countdown } from '@/components/graphics/Countdown'
import { StatsBand } from '@/components/graphics/graphics'
import { IllustrationHero, PhotoHero, PlainHero, usableImages } from '@/components/Hero'

import { getGlobal } from '@/lib/globals'

import type { BlockProps } from './types'

export async function HeroBlock({ block }: BlockProps<'hero'>) {
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

  const actions = (tone: 'light' | 'dark') =>
    (showDonateButton || links.length > 0) && (
      <div className="v1-hero-actions">
        {showDonateButton && <DonateButton className="v1-donate-button" />}
        {links.map(({ link, action }) => (
          <Button
            key={action}
            href={link!.href!}
            variant="secondary"
            tone={tone}
            journey="awareness"
            action={action}
          >
            {link!.label}
          </Button>
        ))}
      </div>
    )
  const countdownPanel = countdown?.target && countdown.label && (
    <Countdown target={countdown.target} label={countdown.label} units={countdown.units} />
  )
  const statsBand = stats && stats.length > 0 && <StatsBand stats={stats} />
  const text = { kicker, heading, lead }

  if (style === 'map') {
    const { logo, brandTitle } = await getGlobal('header')
    return (
      <div className="v1-fold">
        <IllustrationHero
          {...text}
          logo={typeof logo === 'object' && logo?.url ? logo : undefined}
          brandTitle={brandTitle}
          aside={countdownPanel}
        >
          {actions('light')}
        </IllustrationHero>
      </div>
    )
  }
  const props = {
    ...text,
    children: (
      <>
        {actions('dark')}
        {countdownPanel}
      </>
    ),
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
