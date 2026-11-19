'use client'

import { Play } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { youTubeEmbed, youTubeThumbnail } from '@/utils/youtube'

// A thumbnail until someone presses play, so nothing loads from YouTube before then.
export function SessionVideo({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  const frame = useRef<HTMLIFrameElement>(null)

  // The play button goes once pressed, so keyboard focus moves on to the player.
  useEffect(() => {
    if (playing) frame.current?.focus()
  }, [playing])

  return (
    <div className="session-video">
      {playing ? (
        <iframe
          ref={frame}
          src={youTubeEmbed(id)}
          title={`Video: ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)}>
          {/* eslint-disable-next-line @next/next/no-img-element -- YouTube serves it already sized */}
          <img src={youTubeThumbnail(id)} alt="" loading="lazy" decoding="async" />
          <span className="session-video-play">
            <Play aria-hidden="true" />
          </span>
          <span className="v1-sr-only">Play video: {title}</span>
        </button>
      )}
    </div>
  )
}
