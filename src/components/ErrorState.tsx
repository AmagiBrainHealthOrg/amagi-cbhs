import React from 'react'

type Props = {
  heading: string
  body?: string
  /** A link or button that gets the visitor moving again. */
  action?: React.ReactNode
  headingLevel?: 'h1' | 'h2'
}

export function ErrorState({ heading, body, action, headingLevel: Heading = 'h1' }: Props) {
  return (
    <section className="v1-section error-state">
      <Heading>{heading}</Heading>
      {body && <p>{body}</p>}
      {action && <div className="error-state-actions">{action}</div>}
    </section>
  )
}
