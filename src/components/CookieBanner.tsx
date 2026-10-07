'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { CONSENT_EVENT, type Consent, getConsent, setConsent } from '@/lib/consent'
import { withBreaks } from '@/utils/withBreaks'

const OPEN_EVENT = 'cbhs:cookie-settings'

const subscribe = (onChange: () => void) => {
  window.addEventListener(CONSENT_EVENT, onChange)
  return () => window.removeEventListener(CONSENT_EVENT, onChange)
}

type Props = {
  heading: string
  body?: string | null
  acceptLabel: string
  rejectLabel: string
  policy?: { href: string; label: string }
}

// SPEC §10.5: not a modal and no focus trap. It sits in the page flow, sticking to the bottom of
// the viewport, so it never covers the header's Donate button.
export function CookieBanner({ heading, body, acceptLabel, rejectLabel, policy }: Props) {
  // undefined on the server: the cookie is only read in the browser, so nothing renders until then.
  const consent = useSyncExternalStore(subscribe, getConsent, () => undefined)
  const [reopened, setReopened] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const open = () => {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      setReopened(true)
      ref.current?.focus()
    }
    window.addEventListener(OPEN_EVENT, open)
    return () => window.removeEventListener(OPEN_EVENT, open)
  }, [])

  useEffect(() => {
    if (reopened) ref.current?.focus()
  }, [reopened])

  if (consent === undefined || (consent && !reopened)) return null

  const choose = (choice: Consent) => {
    setConsent(choice)
    setReopened(false)
    opener.current?.focus()
    opener.current = null
  }

  return (
    <section
      ref={ref}
      className="cookie-banner"
      aria-labelledby="cookie-banner-heading"
      tabIndex={-1}
    >
      <div className="cookie-banner-text">
        <h2 id="cookie-banner-heading">{heading}</h2>
        {body && <p>{withBreaks(body)}</p>}
        {policy && (
          <p>
            <Link href={policy.href}>{policy.label}</Link>
          </p>
        )}
      </div>
      <div className="cookie-banner-actions">
        <button type="button" className="button button-outline" onClick={() => choose('analytics')}>
          {acceptLabel}
        </button>
        <button type="button" className="button button-outline" onClick={() => choose('rejected')}>
          {rejectLabel}
        </button>
      </div>
    </section>
  )
}

export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="site-footer-button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
    >
      {label}
    </button>
  )
}
