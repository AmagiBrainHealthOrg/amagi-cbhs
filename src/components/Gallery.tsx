'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React, { useRef } from 'react'

import type { Media } from '@/payload-types'

// A row of photos at one height, each keeping its own shape. Scrolls sideways by swipe,
// trackpad, keyboard or the buttons.
export function Gallery({ label, photos }: { label: string; photos: Media[] }) {
  const track = useRef<HTMLUListElement>(null)
  const scroll = (direction: 1 | -1) => {
    const el = track.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div className="gallery">
      <ul ref={track} className="gallery-track" tabIndex={0} role="region" aria-label={label}>
        {photos.map((photo) => (
          <li key={photo.id}>
            <Image
              src={photo.url!}
              alt={photo.alt}
              width={photo.width ?? 1200}
              height={photo.height ?? 900}
              sizes="(max-width: 600px) 90vw, 640px"
            />
          </li>
        ))}
      </ul>
      {photos.length > 1 && (
        <div className="gallery-controls">
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous photos">
            <ChevronLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Next photos">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
