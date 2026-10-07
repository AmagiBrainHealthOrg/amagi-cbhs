import {
  ArrowRight,
  BadgeCheck,
  FileText,
  Globe,
  GraduationCap,
  HandHeart,
  Landmark,
  Lock,
  Megaphone,
  Scale,
  ShieldPlus,
  Stethoscope,
  Users,
  Video,
} from 'lucide-react'
import React from 'react'

import { Card } from '@/components/Card'
import type { IconKey } from '@/config/icons'

import { caribbeanMap } from './caribbeanMap'

export const icons: Record<IconKey, typeof Megaphone> = {
  megaphone: Megaphone,
  shield: ShieldPlus,
  stethoscope: Stethoscope,
  graduation: GraduationCap,
  landmark: Landmark,
  users: Users,
  video: Video,
  'hand-heart': HandHeart,
  'file-text': FileText,
  scale: Scale,
  'badge-check': BadgeCheck,
  lock: Lock,
}

export type IconName = IconKey

export function StatsBand({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <ul className="v1-stats" aria-label="The Summit in numbers">
      {stats.map(({ value, label }, index) => (
        <li key={index}>
          <strong>{value}</strong>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  )
}

export function Statement({ text, source }: { text: string; source?: string }) {
  return (
    <figure className="v1-statement">
      <blockquote>
        <p>{text}</p>
      </blockquote>
      {source && <figcaption>{source}</figcaption>}
    </figure>
  )
}

export type MapCountry = {
  name: string
  city?: string | null
  x: number
  y: number
  anchor?: boolean | null
  labelSide: 'left' | 'right'
}

export function CaribbeanMap({
  countries,
  online,
}: {
  countries: MapCountry[]
  online?: string | null
}) {
  const { width, height, d } = caribbeanMap
  const anchor = countries.find((country) => country.anchor)

  return (
    <div className="v1-map">
      {/* The list below carries the same information for assistive tech. */}
      <svg className="v1-map-svg" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <defs>
          <pattern id="v1-map-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" />
          </pattern>
        </defs>
        <rect className="v1-map-sea" width={width} height={height} fill="url(#v1-map-dots)" />
        <path className="v1-map-land" d={d} />
        {anchor &&
          countries
            .filter((country) => !country.anchor)
            .map(({ name, x, y }, index) => {
              // Bow each arc sideways, alternating sides, so links on similar bearings fan apart.
              const bow = index % 2 ? 0.2 : -0.2
              const controlX = (x + anchor.x) / 2 + (y - anchor.y) * bow
              const controlY = (y + anchor.y) / 2 - (x - anchor.x) * bow
              return (
                <path
                  key={name}
                  className="v1-map-link"
                  d={`M${anchor.x},${anchor.y} Q${controlX},${controlY} ${x},${y}`}
                />
              )
            })}
        {countries.map(({ name, x, y, anchor: isAnchor, labelSide }) => (
          <g key={name} className={`v1-map-pin${isAnchor ? ' v1-map-pin-anchor' : ''}`}>
            <circle className="v1-map-pulse" cx={x} cy={y} r={isAnchor ? 16 : 11} />
            <circle className="v1-map-dot" cx={x} cy={y} r={isAnchor ? 11 : 7} />
            <text
              x={labelSide === 'left' ? x - 20 : x + 20}
              y={y + 6}
              textAnchor={labelSide === 'left' ? 'end' : 'start'}
            >
              {isAnchor ? `${name} · Anchor Day` : name}
            </text>
          </g>
        ))}
      </svg>
      <ul className="v1-map-list">
        {countries.map(({ name, city, anchor: isAnchor }) => (
          <li key={name} className={isAnchor ? 'v1-map-list-anchor' : undefined}>
            <span aria-hidden="true" />
            <strong>{name}</strong>
            <small>{isAnchor ? 'Anchor Day' : city}</small>
          </li>
        ))}
        {online && (
          <li className="v1-map-list-online">
            <Globe aria-hidden="true" />
            <strong>{online}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}

export type WeekDay = {
  day: string
  date: string
  label: string
  body?: string | null
  anchor?: boolean | null
}

export function WeekStrip({ days }: { days: WeekDay[] }) {
  return (
    <ol className="v1-week">
      {days.map(({ day, date, label, body, anchor: isAnchor }, index) => (
        <li key={index} className={isAnchor ? 'v1-week-anchor' : undefined}>
          <p className="v1-week-date">
            <span>{day}</span>
            <strong>{date}</strong>
            <span>Nov</span>
          </p>
          <div>
            <h3>{label}</h3>
            {body && <p>{body}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}

export type Step = {
  when?: string | null
  title: string
  body?: string | null
  status: 'done' | 'now' | 'next'
}

const statusLabel = { done: 'Done', now: 'We are here', next: 'Coming up' }

export function Roadmap({ steps, numbered = false }: { steps: Step[]; numbered?: boolean }) {
  const nowIndex = steps.findIndex((step) => step.status === 'now')
  const progress = nowIndex < 0 ? 0 : (nowIndex + 0.5) / steps.length

  return (
    <ol
      className="v1-roadmap"
      style={{ '--v1-steps': steps.length, '--v1-progress': progress } as React.CSSProperties}
    >
      {steps.map(({ when, title, body, status }, index) => (
        <li key={index} className={`v1-roadmap-${status}`}>
          <span className="v1-roadmap-node" aria-hidden="true">
            {numbered ? index + 1 : null}
          </span>
          <p className="v1-roadmap-status">
            <span className="v1-sr-only">Status: </span>
            {statusLabel[status]}
          </p>
          {when && <p className="v1-roadmap-when">{when}</p>}
          <h3>{title}</h3>
          {body && <p>{body}</p>}
        </li>
      ))}
    </ol>
  )
}

const WHEEL = { size: 440, radius: 158, node: 48 }

type Item = { icon: IconName; title?: string | null; body?: string | null }

export function ActionWheel({
  areas,
  centre,
}: {
  areas: (Item & { title: string })[]
  centre?: string | null
}) {
  const c = WHEEL.size / 2
  const points = areas.map((_, index) => {
    const angle = (index / areas.length) * Math.PI * 2 - Math.PI / 2
    return { x: c + WHEEL.radius * Math.cos(angle), y: c + WHEEL.radius * Math.sin(angle) }
  })

  return (
    <div className="v1-wheel">
      <svg viewBox={`0 0 ${WHEEL.size} ${WHEEL.size}`} aria-hidden="true">
        <polygon
          className="v1-wheel-ring"
          points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
        />
        {points.map(({ x, y }, index) => (
          <line key={index} className="v1-wheel-spoke" x1={c} y1={c} x2={x} y2={y} />
        ))}
        <circle className="v1-wheel-centre" cx={c} cy={c} r={74} />
        {centre && (
          <foreignObject x={c - 64} y={c - 40} width={128} height={80}>
            <p className="v1-wheel-centre-label">{centre}</p>
          </foreignObject>
        )}
        {points.map(({ x, y }, index) => {
          const Icon = icons[areas[index].icon]
          return (
            <g key={index} className={`v1-wheel-node v1-wheel-node-${index % 4}`}>
              <circle cx={x} cy={y} r={WHEEL.node} />
              <Icon x={x - 16} y={y - 22} width={32} height={32} />
              <text x={x} y={y + 30} textAnchor="middle">
                {index + 1}
              </text>
            </g>
          )
        })}
      </svg>
      <ol className="v1-wheel-list">
        {areas.map(({ title, body }, index) => (
          <li key={index} className={`v1-wheel-item-${index % 4}`}>
            <span aria-hidden="true">{index + 1}</span>
            <div>
              <h3>{title}</h3>
              {body && <p>{body}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

const flowIcons: IconName[] = ['landmark', 'users', 'hand-heart', 'users']
const flowDots = [1, 5, 15, 40]

export function FlowDiagram({ steps }: { steps: { title: string; body?: string | null }[] }) {
  return (
    <ol className="v1-flow">
      {steps.map(({ title, body }, index) => {
        const Icon = icons[flowIcons[index % flowIcons.length]]
        return (
          <li key={index}>
            <div className="v1-flow-card">
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              {body && <p>{body}</p>}
              <span className="v1-flow-dots" aria-hidden="true">
                {Array.from({ length: flowDots[index] ?? 40 }, (_, dot) => (
                  <i key={dot} />
                ))}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="v1-flow-arrow" aria-hidden="true" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

const RING_R = [178, 132, 90, 52]
const RING_W = [21, 20, 16, 12]
const SVG_C = 200

export function SupporterRings({ levels }: { levels: { name: string; body?: string | null }[] }) {
  return (
    <div className="v1-rings">
      <svg className="v1-rings-svg" viewBox="0 0 400 400" aria-hidden="true">
        {levels.map((_, i) => (
          <circle
            key={i}
            className={`v1-ring v1-ring-${i}`}
            cx={SVG_C}
            cy={SVG_C}
            r={RING_R[i]}
            fill="none"
            strokeWidth={RING_W[i]}
          />
        ))}
        <circle cx={SVG_C} cy={SVG_C} r={26} className="v1-ring-centre" />
        {levels.map((_, i) => (
          <g key={i} className={`v1-ring-node v1-ring-${i}`}>
            <circle cx={SVG_C} cy={SVG_C - RING_R[i]} r={15} />
            <text
              x={SVG_C}
              y={SVG_C - RING_R[i] + 5}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
      <ol className="v1-rings-list">
        {levels.map(({ name, body }, i) => (
          <li key={i} className={`v1-ring-${i}`}>
            <span aria-hidden="true">{i + 1}</span>
            <div>
              <h3>{name}</h3>
              {body && <p>{body}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function IconTiles({ items }: { items: Item[] }) {
  return (
    <ul className="v1-icon-tiles">
      {items.map((item, index) => (
        <Card key={index} index={index} {...item} />
      ))}
    </ul>
  )
}

export function Badges({ items }: { items: Item[] }) {
  return (
    <ul className="v1-badges">
      {items.map(({ icon, title, body }, index) => {
        const Icon = icons[icon]
        return (
          <li key={index}>
            <Icon aria-hidden="true" />
            {title && <h3>{title}</h3>}
            {body && <p>{body}</p>}
          </li>
        )
      })}
    </ul>
  )
}
