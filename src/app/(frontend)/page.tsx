import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { getPayload } from 'payload'
import * as QRCode from 'qrcode'
import { ArrowRight, CalendarDays, Clock, Globe2, Heart, Mail, MapPin, Users } from 'lucide-react'
import React from 'react'

import { SiteHeader } from '@/components/SiteHeader'
import config from '@/payload.config'
import type { Media } from '@/payload-types'
import { RefreshRouteOnSave } from './RefreshRouteOnSave'

const icons = {
  calendar: CalendarDays,
  'map-pin': MapPin,
  globe: Globe2,
  users: Users,
  clock: Clock,
  mail: Mail,
}

// Each background image holds for this long before crossfading to the next.
const SECONDS_PER_IMAGE = 8

type Props = { searchParams: Promise<{ preview?: string }> }

const asMedia = (value: number | Media | null | undefined) =>
  value && typeof value === 'object' ? value : undefined

const withBreaks = (text?: string | null) =>
  text?.split('\n').map((line, index, lines) => (
    <React.Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </React.Fragment>
  ))

async function getComingSoon(searchParams: Props['searchParams']) {
  const payload = await getPayload({ config })
  const { preview } = await searchParams
  const { user } = await payload.auth({ headers: await getHeaders() })
  const draft = preview === 'true' && Boolean(user)

  return { data: await payload.findGlobal({ slug: 'coming-soon', draft }), draft }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { data } = await getComingSoon(searchParams)
  const image = asMedia(data.meta?.image)

  return {
    title: data.meta?.title || undefined,
    description: data.meta?.description || undefined,
    openGraph: image?.url ? { images: [image.url] } : undefined,
  }
}

// Builds the crossfade keyframes for however many images are set. With five
// images this reproduces the original 40s cycle (fade in 5%, hold to 20%, out by 25%).
const crossfadeKeyframes = (count: number) => {
  const step = 100 / count
  return `@keyframes coming-soon-image-cycle {
  0% { opacity: 0; transform: scale(1); }
  ${step / 4}% { opacity: 1; }
  ${step}% { opacity: 1; transform: scale(1.1); }
  ${Math.min(step * 1.25, 100)}%, 100% { opacity: 0; transform: scale(1.12); }
}`
}

export default async function ComingSoonPage({ searchParams }: Props) {
  const { data, draft } = await getComingSoon(searchParams)
  const logo = asMedia(data.logo)
  const backgrounds = (data.backgroundImages ?? [])
    .map(asMedia)
    .filter((image) => image?.url) as Media[]
  const qrCodeUrl = data.cta?.url
    ? await QRCode.toDataURL(data.cta.url, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 240,
        color: { dark: '#0B1F33', light: '#FFFFFF' },
      })
    : undefined

  return (
    <div className="coming-soon-page">
      {draft && <RefreshRouteOnSave />}
      <a className="skip-link" href="#coming-soon-main">
        Skip to content
      </a>

      <SiteHeader />

      <main className="coming-soon-main" id="coming-soon-main">
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
        <section className="coming-soon-panel" aria-labelledby="coming-soon-title">
          {data.kicker && <p className="coming-soon-kicker">{data.kicker}</p>}
          <h1 id="coming-soon-title">{withBreaks(data.headline)}</h1>
          {data.lead && <p className="coming-soon-lead">{data.lead}</p>}
          {data.body && <p className="coming-soon-copy">{data.body}</p>}

          {data.cta?.url && (
            <div className="coming-soon-register">
              <div className="coming-soon-actions">
                <Link
                  className="button button-orange coming-soon-cta"
                  href="/donate"
                  data-journey="donate"
                  data-action="donate_click"
                  data-destination-type="internal"
                >
                  {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
                  <Heart aria-hidden="true" /> Donate
                </Link>
                {data.cta.label && (
                  <a
                    className="button button-outline-light coming-soon-cta"
                    href={data.cta.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.cta.label} <ArrowRight aria-hidden="true" />
                  </a>
                )}
              </div>
              <aside className="coming-soon-qr" aria-labelledby="coming-soon-qr-title">
                <div>
                  {data.qr?.label && <p id="coming-soon-qr-title">{data.qr.label}</p>}
                  {data.qr?.sublabel && <small>{data.qr.sublabel}</small>}
                </div>
                <a
                  href={data.cta.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open the registration form"
                >
                  <img src={qrCodeUrl} alt="QR code for the registration form" />
                </a>
              </aside>
            </div>
          )}

          {Boolean(data.details?.length) && (
            <div className="coming-soon-details" aria-label="Summit details">
              {data.details!.map(({ id, icon, title, subtitle }) => {
                const Icon = icons[icon ?? 'calendar']
                return (
                  <div key={id}>
                    <Icon aria-hidden="true" />
                    <span>
                      <strong>{title}</strong>
                      {subtitle && <small>{subtitle}</small>}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="coming-soon-footer">
        <span>{data.footerLeft}</span>
        <span>{data.footerRight}</span>
      </footer>
    </div>
  )
}
