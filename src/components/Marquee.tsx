'use client'

import { Pause, Play } from 'lucide-react'
import React, { useState } from 'react'

// WCAG 2.2.2: anything that moves for more than five seconds needs a way to stop it. Hover and
// focus also pause it (CSS), and reduced motion stops it altogether.
export function Marquee({ seconds, children }: { seconds: number; children: React.ReactNode }) {
  const [paused, setPaused] = useState(false)

  return (
    <div
      className="v1-marquee"
      data-paused={paused || undefined}
      style={{ '--marquee-duration': `${seconds}s` } as React.CSSProperties}
    >
      <div className="v1-marquee-viewport">{children}</div>
      <button type="button" className="v1-marquee-toggle" onClick={() => setPaused(!paused)}>
        {paused ? <Play aria-hidden="true" size={16} /> : <Pause aria-hidden="true" size={16} />}
        {paused ? 'Play logos' : 'Pause logos'}
      </button>
    </div>
  )
}
