'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

import type { Media } from '@/payload-types'

// A row of photos at one height, each keeping its own shape. Scrolls sideways by swipe,
// trackpad, keyboard or the buttons. Pressing a photo opens it full size in a native dialog,
// which traps focus, closes on Escape and returns focus to the photo.
export function Gallery({ label, photos }: { label: string; photos: Media[] }) {
  const track = useRef<HTMLUListElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = useState(0)
  const scroll = (direction: 1 | -1) => {
    const el = track.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' })
  }
  const open = (index: number) => {
    setCurrent(index)
    dialog.current?.showModal()
  }
  const step = (direction: 1 | -1) =>
    setCurrent((index) => (index + direction + photos.length) % photos.length)
  const photo = photos[current]
  const several = photos.length > 1

  return (
    <div className="gallery">
      <ul ref={track} className="gallery-track" tabIndex={0} role="region" aria-label={label}>
        {photos.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`View larger: ${item.alt}`}
              onClick={() => open(index)}
            >
              <Image
                src={item.url!}
                alt=""
                width={item.width ?? 1200}
                height={item.height ?? 900}
                sizes="(max-width: 600px) 90vw, 640px"
              />
            </button>
          </li>
        ))}
      </ul>
      {several && (
        <div className="gallery-controls">
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous photos">
            <ChevronLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Next photos">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      )}
      <dialog
        ref={dialog}
        className="gallery-lightbox"
        aria-label={label}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close()
        }}
        onKeyDown={(event) => {
          const direction = { ArrowRight: 1, ArrowLeft: -1 }[event.key] as 1 | -1 | undefined
          if (!direction || !several) return
          event.preventDefault()
          step(direction)
        }}
      >
        {photo && (
          <figure>
            <Image
              key={photo.id}
              src={photo.url!}
              alt={photo.alt}
              width={photo.width ?? 1200}
              height={photo.height ?? 900}
              sizes="100vw"
            />
            {several && (
              <figcaption aria-live="polite">
                {current + 1} of {photos.length}
              </figcaption>
            )}
          </figure>
        )}
        <button
          type="button"
          className="gallery-lightbox-close"
          aria-label="Close"
          onClick={() => dialog.current?.close()}
        >
          <X aria-hidden="true" />
        </button>
        {several && (
          <>
            <button
              type="button"
              className="gallery-lightbox-prev"
              aria-label="Previous photo"
              onClick={() => step(-1)}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="gallery-lightbox-next"
              aria-label="Next photo"
              onClick={() => step(1)}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        )}
      </dialog>
    </div>
  )
}
