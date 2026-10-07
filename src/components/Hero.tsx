import React from 'react'

import type { Media } from '@/payload-types'
import { crossfadeKeyframes } from '@/utils/crossfadeKeyframes'
import { withBreaks } from '@/utils/withBreaks'

import { caribbeanMap } from './graphics/caribbeanMap'

const SECONDS_PER_IMAGE = 8

type Props = {
  kicker?: string | null
  heading: string
  lead?: string | null
  children?: React.ReactNode
}

const Wave = () => (
  <svg
    className="v1-hero-wave"
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path d="M0 80 C 240 20 480 20 720 70 S 1200 120 1440 50 V120 H0 Z" />
  </svg>
)

const Inner = ({ kicker, heading, lead, children }: Props) => (
  <div className="v1-hero-inner">
    {kicker && <p className="v1-kicker">{kicker}</p>}
    <h1>{withBreaks(heading)}</h1>
    {lead && <p className="v1-hero-lead">{lead}</p>}
    {children}
  </div>
)

export const usableImages = (images?: (number | Media)[] | null): Media[] =>
  (images ?? []).filter((image): image is Media => typeof image === 'object' && Boolean(image?.url))

export function PhotoHero({
  images,
  size = 'page',
  ...props
}: Props & { images: Media[]; size?: 'home' | 'page' }) {
  return (
    <section className={`v1-hero v1-hero-${size}`}>
      <div className="coming-soon-background" aria-hidden="true">
        {images.length > 1 && <style>{crossfadeKeyframes(images.length)}</style>}
        {images.map((image, index) => (
          <img
            key={image.id}
            className={`coming-soon-image${images.length === 1 ? ' coming-soon-image-static' : ''}`}
            src={image.url!}
            alt=""
            style={{
              objectPosition: `${image.focalX ?? 50}% ${image.focalY ?? 50}%`,
              animationDuration: `${images.length * SECONDS_PER_IMAGE}s`,
              animationDelay: `${index * SECONDS_PER_IMAGE}s`,
            }}
          />
        ))}
      </div>
      <Wave />
      <Inner {...props} />
    </section>
  )
}

export function MapHero(props: Props) {
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
      <Wave />
      <Inner {...props} />
    </section>
  )
}

export function PlainHero({ kicker, heading, lead, children }: Props) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        {kicker && <p className="page-kicker">{kicker}</p>}
        <h1>{withBreaks(heading)}</h1>
        {lead && <p className="page-hero-lead">{lead}</p>}
        {children}
      </div>
    </section>
  )
}
