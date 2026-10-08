import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { Media } from '@/payload-types'

import { Marquee } from './Marquee'

export type Logo = {
  id: number
  name: string
  logo?: number | Media | null
  website?: string | null
  /** The partner's latest announcement (SPEC §4.4). */
  announcement?: { href: string; title: string }
}

const PLACEHOLDER_SLOTS = 6

// Fewer logos than this don't fill a scrolling row, so they sit still in a centred row.
const MARQUEE_MIN_LOGOS = 5

// `hidden` is for the marquee's duplicate set: out of the tab order as well as the accessibility tree.
function LogoEntry({ name, logo, website, hidden }: Logo & { hidden?: boolean }) {
  const image = logo && typeof logo === 'object' && logo.url ? logo : undefined
  const content = image ? (
    <Image
      src={image.url!}
      alt={name}
      width={image.width ?? 300}
      height={image.height ?? 200}
      sizes="200px"
    />
  ) : (
    <span>{name}</span>
  )
  if (!website) return content
  return (
    <a
      href={website}
      rel="noopener"
      tabIndex={hidden ? -1 : undefined}
      data-journey="awareness"
      data-action="outbound"
      data-destination-type="external"
    >
      {content}
    </a>
  )
}

// Callers pass only entries with `permissionConfirmed` (CLAUDE.md hard rules).
export function LogoGrid({ logos, emptyText }: { logos: Logo[]; emptyText?: string | null }) {
  if (logos.length === 0) {
    return (
      <>
        <ul className="v1-logo-slots" aria-hidden="true">
          {Array.from({ length: PLACEHOLDER_SLOTS }, (_, index) => (
            <li key={index} />
          ))}
        </ul>
        {emptyText && <p className="v1-muted">{emptyText}</p>}
      </>
    )
  }

  return (
    <ul className="v1-logos">
      {logos.map((logo) => {
        if (!logo.announcement) {
          return (
            <li key={logo.id}>
              <LogoEntry {...logo} />
            </li>
          )
        }
        return (
          <li key={logo.id} className="v1-logo-entry">
            <div>
              <LogoEntry {...logo} />
            </div>
            <Link className="v1-logo-news" href={logo.announcement.href}>
              {logo.announcement.title}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

// The list repeats once so the CSS animation loops seamlessly; the copy is hidden from
// assistive tech and the keyboard.
export function LogoMarquee({ logos }: { logos: Logo[] }) {
  const list = (hidden: boolean) => (
    <ul
      className={`v1-logos v1-logo-row${logos.length >= MARQUEE_MIN_LOGOS ? ' v1-marquee-track' : ''}`}
      aria-hidden={hidden || undefined}
    >
      {logos.map((logo) => (
        <li key={logo.id}>
          <LogoEntry {...logo} hidden={hidden} />
        </li>
      ))}
    </ul>
  )

  if (logos.length < MARQUEE_MIN_LOGOS) return list(false)

  return (
    <Marquee seconds={logos.length * 4}>
      {list(false)}
      {list(true)}
    </Marquee>
  )
}
