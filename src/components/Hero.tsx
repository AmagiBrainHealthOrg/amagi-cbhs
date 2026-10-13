import { getImageProps } from 'next/image'
import React from 'react'

import heroIllustration from '@/assets/hero-illustration.jpg'
import heroIllustrationMedium from '@/assets/hero-illustration-medium.jpg'
import heroIllustrationMobile from '@/assets/hero-illustration-mobile.jpg'

import type { Media } from '@/payload-types'
import { crossfadeKeyframes } from '@/utils/crossfadeKeyframes'
import { withBreaks } from '@/utils/withBreaks'

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
      <div className="hero-background" aria-hidden="true">
        {images.length > 1 && <style>{crossfadeKeyframes(images.length)}</style>}
        {images.map((image, index) => {
          // Only the first image is on screen at load; the rest fade in later, so they wait.
          const { props } = getImageProps({
            src: image.url!,
            alt: '',
            fill: true,
            sizes: '100vw',
            ...(index === 0
              ? { loading: 'eager', fetchPriority: 'high' }
              : { loading: 'lazy', fetchPriority: 'low' }),
          })
          return (
            <img
              {...props}
              key={image.id}
              className={`hero-image${images.length === 1 ? ' hero-image-static' : ''}`}
              alt=""
              style={{
                ...props.style,
                objectPosition: `${image.focalX ?? 50}% ${image.focalY ?? 50}%`,
                animationDuration: `${images.length * SECONDS_PER_IMAGE}s`,
                animationDelay: `${index * SECONDS_PER_IMAGE}s`,
              }}
            />
          )
        })}
      </div>
      <Wave />
      <Inner {...props} />
    </section>
  )
}

export function IllustrationHero({
  kicker,
  heading,
  lead,
  children,
  logo,
  brandTitle,
  aside,
}: Props & { logo?: Media; brandTitle?: string | null; aside?: React.ReactNode }) {
  const common = {
    alt: '',
    fill: true,
    sizes: '100vw',
    loading: 'eager',
    fetchPriority: 'high',
  } as const
  const { props: desktop } = getImageProps({ ...common, src: heroIllustration })
  const { props: medium } = getImageProps({ ...common, src: heroIllustrationMedium })
  const { props: mobile } = getImageProps({ ...common, src: heroIllustrationMobile })
  return (
    <section className="v1-hero v1-hero-illustration">
      <picture>
        <source media="(min-width: 1440px)" srcSet={desktop.srcSet} sizes={desktop.sizes} />
        <source media="(min-width: 961px)" srcSet={medium.srcSet} sizes={medium.sizes} />
        <img {...mobile} className="v1-hero-illustration-bg" alt="" />
      </picture>
      <Wave />
      <div className="v1-hero-inner">
        <div className="v1-hero-card">
          {logo && (
            <div className="v1-hero-brand">
              <img
                src={logo.url!}
                width={logo.width ?? undefined}
                height={logo.height ?? undefined}
                alt={brandTitle ? '' : (logo.alt ?? '')}
              />
              {brandTitle && <p>{withBreaks(brandTitle)}</p>}
            </div>
          )}
          {kicker && !logo && <p className="v1-kicker">{kicker}</p>}
          <h1>{withBreaks(heading)}</h1>
          {lead && <p className="v1-hero-lead">{lead}</p>}
          {children}
        </div>
        {aside && <div className="v1-hero-aside">{aside}</div>}
      </div>
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
