import { ArrowRight, Check, Stethoscope, User, X } from 'lucide-react'
import React from 'react'

// Graphics drawn for the PLADRR page. Every label is real text, so it reads the same to
// assistive tech; the shapes around it are decoration.

// Full rows only: 8 across in the last panels.
const SCALE_DOTS = [1, 9, 40, 64]

export function ScaleStrip({
  steps,
  highlightLabel,
}: {
  steps: { label: string; highlight?: boolean | null }[]
  highlightLabel?: string | null
}) {
  return (
    <ol className="v1-scale" style={{ '--v1-scale-steps': steps.length } as React.CSSProperties}>
      {steps.map(({ label, highlight }, index) => (
        <li key={index} className={highlight ? 'v1-scale-focus' : undefined}>
          <div className="v1-scale-panel" aria-hidden="true">
            {index === 0 ? (
              <User />
            ) : index === 1 ? (
              <Stethoscope />
            ) : (
              <span className="v1-scale-dots">
                {Array.from({ length: SCALE_DOTS[index] ?? 64 }, (_, dot) => (
                  <i key={dot} />
                ))}
              </span>
            )}
          </div>
          <p>{label}</p>
          {highlight && highlightLabel && <span className="v1-scale-tag">{highlightLabel}</span>}
          {index < steps.length - 1 && <ArrowRight className="v1-scale-arrow" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  )
}

export function Venn({ circles, centre }: { circles: string[]; centre?: string | null }) {
  return (
    <figure className="v1-venn">
      <ul>
        {circles.slice(0, 3).map((label, index) => (
          <li key={index} className={`v1-venn-circle v1-venn-circle-${index}`}>
            <span>{label}</span>
          </li>
        ))}
      </ul>
      {centre && <figcaption className="v1-venn-centre">{centre}</figcaption>}
    </figure>
  )
}

export function Funnel({
  steps,
  end,
}: {
  steps: { when?: string | null; title: string; body?: string | null }[]
  end?: string | null
}) {
  return (
    <div className="v1-funnel">
      <ol style={{ '--v1-funnel-steps': steps.length } as React.CSSProperties}>
        {steps.map(({ when, title, body }, index) => (
          <li key={index} style={{ '--v1-funnel-index': index } as React.CSSProperties}>
            {when && <span className="v1-funnel-when">{when}</span>}
            <div>
              <h3>{title}</h3>
              {body && <p>{body}</p>}
            </div>
          </li>
        ))}
      </ol>
      {end && <p className="v1-funnel-end">{end}</p>}
    </div>
  )
}

type Side = { heading: string; items?: { text: string; id?: string | null }[] | null }

export function Comparison({ is, isNot }: { is: Side; isNot: Side }) {
  return (
    <div className="v1-compare">
      {[
        { side: is, Icon: Check, className: 'v1-compare-is' },
        { side: isNot, Icon: X, className: 'v1-compare-not' },
      ].map(({ side, Icon, className }) => (
        <div key={className} className={className}>
          <h3>{side.heading}</h3>
          <ul>
            {(side.items ?? []).map(({ text, id }) => (
              <li key={id ?? text}>
                <Icon aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
