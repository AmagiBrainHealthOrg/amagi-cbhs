import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

export type DestinationType = 'internal' | 'external' | 'email'

type Props = {
  href: string
  children: React.ReactNode
  journey: string
  action: string
  destinationType?: DestinationType
  variant?: ButtonVariant
  /** Background the button sits on; secondary buttons switch outline colour. */
  tone?: 'light' | 'dark'
  className?: string
}

export const destinationTypeFor = (href: string): DestinationType => {
  if (href.startsWith('mailto:')) return 'email'
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) return 'external'
  return 'internal'
}

const variantClass: Record<ButtonVariant, Record<'light' | 'dark', string>> = {
  primary: { light: 'button button-orange', dark: 'button button-orange' },
  secondary: { light: 'button button-outline', dark: 'button button-outline-light' },
  tertiary: { light: 'v1-text-link', dark: 'v1-text-link' },
}

// SPEC §10.3: every CTA button carries the three tracking attributes.
export function Button({
  href,
  children,
  journey,
  action,
  destinationType = destinationTypeFor(href),
  variant = 'secondary',
  tone = 'light',
  className,
}: Props) {
  const props = {
    className: [variantClass[variant][tone], className].filter(Boolean).join(' '),
    'data-journey': journey,
    'data-action': action,
    'data-destination-type': destinationType,
  }
  const content = (
    <>
      {children}
      {variant === 'tertiary' && (
        <>
          {' '}
          <ArrowRight aria-hidden="true" />
        </>
      )}
    </>
  )

  if (destinationType === 'internal') {
    return (
      <Link href={href} {...props}>
        {content}
      </Link>
    )
  }
  return (
    <a href={href} {...props} {...(destinationType === 'external' && { rel: 'noopener' })}>
      {content}
    </a>
  )
}
