'use client'

import React, { useEffect, useId, useRef, useState } from 'react'

import { SessionDescription } from './SessionDescription'

type Props = {
  title: string
  details: string[]
  description: string
  /** The card's buttons, such as Register, which share Read more's row. */
  children?: React.ReactNode
}

// A session card shows its description clamped to a few lines; Read more opens the whole of it
// in a modal. The native dialog traps focus, closes on Escape and returns focus to the button.
export function SessionMore({ title, details, description, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const body = useRef<HTMLParagraphElement>(null)
  const titleId = useId()
  const [long, setLong] = useState(false)

  // Read more shows only while the clamp actually cuts the text, which depends on card width.
  useEffect(() => {
    const el = body.current
    if (!el) return
    const check = () => setLong(el.scrollHeight > el.clientHeight + 1)
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <p ref={body} className="country-session-body">
        <SessionDescription text={description} />
      </p>
      {(children || long) && (
        <div className="country-session-actions">
          {children}
          {long && (
            <button
              type="button"
              className="v1-team-more"
              aria-haspopup="dialog"
              onClick={() => dialog.current?.showModal()}
            >
              Read more<span className="v1-sr-only"> about {title}</span>
            </button>
          )}
        </div>
      )}
      {long && (
        <>
          <dialog
            ref={dialog}
            className="v1-team-dialog"
            aria-labelledby={titleId}
            onClick={(event) => {
              if (event.target === event.currentTarget) dialog.current?.close()
            }}
          >
            <div className="v1-team-dialog-body">
              <button
                type="button"
                className="v1-team-dialog-close"
                onClick={() => dialog.current?.close()}
              >
                <span aria-hidden="true">×</span>
                <span className="v1-sr-only">Close</span>
              </button>
              <h2 id={titleId}>{title}</h2>
              {details.length > 0 && (
                <p className="country-session-details">{details.join(' · ')}</p>
              )}
              <p>
                <SessionDescription text={description} />
              </p>
            </div>
          </dialog>
        </>
      )}
    </>
  )
}
