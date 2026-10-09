'use client'

import React, { useId, useRef } from 'react'

type Props = { name: string; subtitle?: string; paragraphs: string[] }

// The card shows the bio clamped to a few lines; Read more opens the whole bio in a modal. The
// native dialog traps focus, closes on Escape and returns focus to the button.
export function TeamBio({ name, subtitle, paragraphs }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const long = paragraphs.length > 1 || paragraphs.join(' ').length > 280

  return (
    <>
      <div className={`v1-team-bio${long ? ' v1-team-bio-clamped' : ''}`}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {long && (
        <>
          <button
            type="button"
            className="v1-team-more"
            aria-haspopup="dialog"
            onClick={() => dialog.current?.showModal()}
          >
            Read more<span className="v1-sr-only"> about {name}</span>
          </button>
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
              <h2 id={titleId}>{name}</h2>
              {subtitle && <p className="v1-team-role">{subtitle}</p>}
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </dialog>
        </>
      )}
    </>
  )
}
