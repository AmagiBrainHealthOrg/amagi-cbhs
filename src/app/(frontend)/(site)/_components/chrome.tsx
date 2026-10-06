import { ArrowRight, Heart } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Media } from '@/payload-types'
import { crossfadeKeyframes } from '@/utils/crossfadeKeyframes'

import { donateBanner } from '../_content'
import { caribbeanMap } from './caribbeanMap'

const SECONDS_PER_IMAGE = 8

const withBreaks = (text: string) =>
  text.split('\n').map((line, index, lines) => (
    <React.Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </React.Fragment>
  ))

export function DonateButton({ label = 'Donate', className = '' }: { label?: string; className?: string }) {
  return (
    // TODO: push the donate_click data-layer event (T015) only when a human developer decides to.
    <Link
      className={`button button-orange v1-donate-button ${className}`}
      href="/donate"
      data-journey="donate"
      data-action="donate_click"
      data-destination-type="internal"
    >
      <Heart aria-hidden="true" /> {label}
    </Link>
  )
}

export function SectionHeading({
  id,
  kicker,
  heading,
  body,
  tone = 'light',
}: {
  id: string
  kicker?: string
  heading: string
  body?: string
  tone?: 'light' | 'dark'
}) {
  return (
    <header className={`v1-section-heading v1-section-heading-${tone}`}>
      {kicker && <p className="v1-kicker">{kicker}</p>}
      <h2 id={id}>{heading}</h2>
      {body && <p>{body}</p>}
    </header>
  )
}

async function getBackgrounds() {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({ slug: 'coming-soon', depth: 1 })
  return (data.backgroundImages ?? []).filter(
    (image): image is Media => typeof image === 'object' && Boolean(image?.url),
  )
}

export async function PhotoHero({
  kicker,
  heading,
  lead,
  children,
  size = 'page',
}: {
  kicker?: string
  heading: string
  lead?: string
  children?: React.ReactNode
  size?: 'home' | 'page'
}) {
  const backgrounds = await getBackgrounds()

  return (
    <section className={`v1-hero v1-hero-${size}`}>
      <div className="coming-soon-background" aria-hidden="true">
        {backgrounds.length > 1 && <style>{crossfadeKeyframes(backgrounds.length)}</style>}
        {backgrounds.map((image, index) => (
          <img
            key={image.id}
            className={`coming-soon-image${backgrounds.length === 1 ? ' coming-soon-image-static' : ''}`}
            src={image.url!}
            alt=""
            style={{
              objectPosition: `${image.focalX ?? 50}% ${image.focalY ?? 50}%`,
              animationDuration: `${backgrounds.length * SECONDS_PER_IMAGE}s`,
              animationDelay: `${index * SECONDS_PER_IMAGE}s`,
            }}
          />
        ))}
      </div>
      <svg className="v1-hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 80 C 240 20 480 20 720 70 S 1200 120 1440 50 V120 H0 Z" />
      </svg>
      <div className="v1-hero-inner">
        {kicker && <p className="v1-kicker">{kicker}</p>}
        <h1>{withBreaks(heading)}</h1>
        {lead && <p className="v1-hero-lead">{lead}</p>}
        {children}
      </div>
    </section>
  )
}

export function MapHero({
  kicker,
  heading,
  lead,
  children,
}: {
  kicker?: string
  heading: string
  lead?: string
  children?: React.ReactNode
}) {
  const { width, height, d } = caribbeanMap
  return (
    <section className="v1-hero v1-hero-map">
      <svg
        className="v1-hero-map-bg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path d={d} />
      </svg>
      <svg className="v1-hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 80 C 240 20 480 20 720 70 S 1200 120 1440 50 V120 H0 Z" />
      </svg>
      <div className="v1-hero-inner">
        {kicker && <p className="v1-kicker">{kicker}</p>}
        <h1>{withBreaks(heading)}</h1>
        {lead && <p className="v1-hero-lead">{lead}</p>}
        {children}
      </div>
    </section>
  )
}

export function DonateBand() {
  return (
    <section className="v1-donate-band" aria-labelledby="v1-donate-band-title">
      <div className="v1-donate-band-inner">
        <h2 id="v1-donate-band-title">{donateBanner.heading}</h2>
        <p>{donateBanner.body}</p>
        <DonateButton label={donateBanner.label} />
      </div>
    </section>
  )
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="v1-text-link" href={href}>
      {children} <ArrowRight aria-hidden="true" />
    </Link>
  )
}
