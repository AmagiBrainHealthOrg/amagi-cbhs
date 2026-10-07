import React from 'react'

export type SectionFields = {
  kicker?: string | null
  heading?: string | null
  intro?: string | null
  background?: 'white' | 'pale' | 'blue' | null
  anchorId?: string | null
}

type HeadingProps = {
  id?: string
  kicker?: string | null
  heading?: string | null
  body?: string | null
  tone?: 'light' | 'dark'
}

export function SectionHeading({ id, kicker, heading, body, tone = 'light' }: HeadingProps) {
  if (!kicker && !heading && !body) return null
  return (
    <header className={`v1-section-heading v1-section-heading-${tone}`}>
      {kicker && <p className="v1-kicker">{kicker}</p>}
      {heading && <h2 id={id}>{heading}</h2>}
      {body && <p>{body}</p>}
    </header>
  )
}

type Props = SectionFields & {
  /** Unique per page; used for the heading id when there is no anchor. */
  blockId: string
  /** Classes for the element that holds the heading and content. */
  className?: string
  /** Set false when the content shows the intro itself. */
  showIntro?: boolean
  children?: React.ReactNode
}

// White sections sit in the page column; pale and blue run full width as bands.
export function Section({
  kicker,
  heading,
  intro,
  background,
  anchorId,
  blockId,
  className,
  showIntro = true,
  children,
}: Props) {
  const headingId = heading ? `${anchorId || blockId}-heading` : undefined
  const tone = background === 'blue' ? 'dark' : 'light'
  const content = (
    <>
      <SectionHeading
        id={headingId}
        kicker={kicker}
        heading={heading}
        body={showIntro ? intro : undefined}
        tone={tone}
      />
      {children}
    </>
  )
  const sectionProps = { id: anchorId || undefined, 'aria-labelledby': headingId }

  if (background === 'pale' || background === 'blue') {
    return (
      <section className={`v1-band v1-band-${background}`} {...sectionProps}>
        <div className={['v1-band-inner', className].filter(Boolean).join(' ')}>{content}</div>
      </section>
    )
  }
  return (
    <section className={['v1-section', className].filter(Boolean).join(' ')} {...sectionProps}>
      {content}
    </section>
  )
}
