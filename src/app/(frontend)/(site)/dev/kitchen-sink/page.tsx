import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Accordion } from '@/components/Accordion'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { DonateButton } from '@/components/DonateButton'
import { ErrorState } from '@/components/ErrorState'
import { LogoGrid } from '@/components/LogoGrid'
import { Section } from '@/components/Section'
import { Teaser } from '@/components/Teaser'

import { sampleBlocks } from './sample'

export const metadata: Metadata = { title: 'Kitchen sink', robots: { index: false, follow: false } }

export default function KitchenSinkPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <>
      <RenderBlocks blocks={sampleBlocks} />

      <Section blockId="components" heading="Components" kicker="Kitchen sink" background="white">
        <Breadcrumbs
          label="Breadcrumb"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Section', href: '/about' },
            { label: 'This page' },
          ]}
        />
        <div className="error-state-actions">
          <DonateButton />
          <Button href="/about" variant="secondary" journey="awareness" action="sample">
            Secondary
          </Button>
          <Button href="/about" variant="tertiary" journey="awareness" action="sample">
            Tertiary
          </Button>
          <Button
            href="https://example.org"
            variant="tertiary"
            journey="awareness"
            action="outbound"
          >
            External tertiary
          </Button>
        </div>
      </Section>

      <Section blockId="components-dark" heading="Buttons on blue" background="blue">
        <div className="v1-hero-actions">
          <Button href="/about" variant="secondary" tone="dark" journey="awareness" action="sample">
            Secondary on blue
          </Button>
        </div>
      </Section>

      <Section blockId="cards" heading="Card, Teaser and LogoGrid" background="white">
        <ul className="v1-icon-tiles">
          <Card icon="megaphone" title="A single card" body="Cards sit in a tile list." />
        </ul>
        <ul className="v1-news">
          <Teaser
            href="/news"
            title="A sample teaser"
            date="2026-10-01"
            summary="Teaser summary."
            label="News"
          />
        </ul>
        <LogoGrid
          logos={[
            { id: 1, name: 'Sample organisation' },
            { id: 2, name: 'Linked organisation', website: 'https://example.org' },
          ]}
        />
      </Section>

      <Section blockId="accordion" heading="Accordion" background="white">
        <div className="faq-list">
          <Accordion
            items={[
              { question: 'A sample question?', answer: 'A sample answer.' },
              { question: 'Another question?', answer: 'Another answer.' },
            ]}
          />
        </div>
      </Section>

      <ErrorState
        headingLevel="h2"
        heading="Error state"
        body="Shown by the not-found and error boundaries."
        action={
          <Button href="/" variant="secondary" journey="awareness" action="sample">
            Action
          </Button>
        }
      />
    </>
  )
}
