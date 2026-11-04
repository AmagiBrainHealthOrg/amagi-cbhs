'use client'

import { Info, X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

import { SessionDescription } from './SessionDescription'

const GAP = 8
const OPEN_DELAY = 100
// Long enough to cross from the button into the popover.
const CLOSE_DELAY = 250

// A native popover: the top layer keeps it clear of the card, and the browser handles Esc,
// clicking away and closing any other open popover. Hovering previews it; clicking keeps it open.
export function SessionInfo({ id, title, text }: { id: string; title: string; text: string }) {
  const button = useRef<HTMLButtonElement>(null)
  const popover = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const pinned = useRef(false)
  const listening = useRef<AbortController>(undefined)

  useEffect(
    () => () => {
      clearTimeout(timer.current)
      listening.current?.abort()
    },
    [],
  )

  const place = () => {
    const panel = popover.current
    if (!button.current || !panel) return
    const anchor = button.current.getBoundingClientRect()
    const { offsetWidth: width, offsetHeight: height } = panel
    const maxLeft = document.documentElement.clientWidth - width - GAP
    const maxTop = window.innerHeight - height - GAP
    const below = anchor.bottom + GAP
    const above = anchor.top - height - GAP
    panel.style.left = `${Math.max(GAP, Math.min(anchor.right - width, maxLeft))}px`
    panel.style.top = `${below <= maxTop ? below : above >= GAP ? above : Math.max(GAP, maxTop)}px`
  }

  const show = () => {
    if (!popover.current?.matches(':popover-open')) popover.current?.showPopover()
    place()
  }

  const schedule = (action: () => void, delay: number) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(action, delay)
  }

  const leave = () => {
    if (!pinned.current) schedule(() => popover.current?.hidePopover(), CLOSE_DELAY)
  }

  return (
    <>
      <button
        ref={button}
        type="button"
        className="schedule-info"
        aria-label={`About this session: ${title}`}
        popoverTarget={id}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') schedule(show, OPEN_DELAY)
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') leave()
        }}
        onClick={(event) => {
          // A click on an open preview keeps it open, so this replaces the native toggle.
          event.preventDefault()
          clearTimeout(timer.current)
          if (pinned.current) {
            popover.current?.hidePopover()
          } else {
            pinned.current = true
            show()
          }
        }}
      >
        <Info aria-hidden="true" />
      </button>
      <div
        ref={popover}
        id={id}
        popover="auto"
        className="schedule-info-panel"
        onPointerEnter={() => clearTimeout(timer.current)}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') leave()
        }}
        onPointerDown={() => {
          pinned.current = true
        }}
        onToggle={(event) => {
          listening.current?.abort()
          if (event.newState === 'open') {
            listening.current = new AbortController()
            const { signal } = listening.current
            window.addEventListener('scroll', place, { capture: true, passive: true, signal })
            window.addEventListener('resize', place, { signal })
          } else {
            clearTimeout(timer.current)
            pinned.current = false
          }
        }}
      >
        <button
          type="button"
          className="schedule-info-close"
          aria-label="Close"
          onClick={() => popover.current?.hidePopover()}
        >
          <X aria-hidden="true" />
        </button>
        <p>
          <SessionDescription text={text} />
        </p>
      </div>
    </>
  )
}
