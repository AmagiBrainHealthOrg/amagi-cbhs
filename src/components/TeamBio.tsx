'use client'

import React, { useId, useState } from 'react'

// Long bios are clamped to a few lines until opened. The clamp is visual only: the full text is
// always in the page for screen readers and search.
export function TeamBio({ name, paragraphs }: { name: string; paragraphs: string[] }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const long = paragraphs.length > 1 || paragraphs.join(' ').length > 280

  return (
    <>
      <div id={id} className={`v1-team-bio${long && !open ? ' v1-team-bio-clamped' : ''}`}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {long && (
        <button
          type="button"
          className="v1-team-more"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          {open ? 'Show less' : 'Read more'}
          <span className="v1-sr-only"> about {name}</span>
        </button>
      )}
    </>
  )
}
