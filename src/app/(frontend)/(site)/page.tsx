import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { formatDate } from '@/utils/formatDate'

import { Countdown } from './_components/Countdown'
import { DonateBand, DonateButton, MapHero, SectionHeading, TextLink } from './_components/chrome'
import {
  ActionWheel,
  CaribbeanMap,
  Roadmap,
  Statement,
  StatsBand,
  WeekStrip,
} from './_components/graphics'
import { actionAreaIcons, callToAction, callToActionV1, home, news, roadmap, summitStart } from './_content'

export const metadata: Metadata = { title: 'Caribbean Brain Health Summit 2026 (v1)' }

export default function V1HomePage() {
  const { hero } = home

  return (
    <>
      <MapHero kicker={hero.kicker} heading={hero.heading} lead={hero.lead}>
        <div className="v1-hero-actions">
          <DonateButton />
          <Link className="button button-outline-light" href={hero.secondary.href}>
            {hero.secondary.label}
          </Link>
        </div>
        <Countdown target={summitStart} label="Summit week starts in" />
      </MapHero>

      <StatsBand stats={home.stats} />

      <section className="v1-section" aria-label="Why brain health">
        <Statement text={home.statement.text} source={home.statement.source} />
      </section>

      <section className="v1-band v1-band-blue" aria-labelledby="v1-map-heading">
        <div className="v1-band-inner v1-split">
          <SectionHeading
            id="v1-map-heading"
            kicker={home.map.kicker}
            heading={home.map.heading}
            body={home.map.body}
            tone="dark"
          />
          <CaribbeanMap online={home.map.online} />
        </div>
      </section>

      <section className="v1-section v1-reveal" id="week" aria-labelledby="v1-week-heading">
        <SectionHeading
          id="v1-week-heading"
          kicker={home.week.kicker}
          heading={home.week.heading}
          body={home.week.body}
        />
        <WeekStrip />
      </section>

      <section className="v1-band v1-band-pale" aria-labelledby="v1-roadmap-heading">
        <div className="v1-band-inner v1-reveal">
          <SectionHeading
            id="v1-roadmap-heading"
            kicker={home.roadmap.kicker}
            heading={home.roadmap.heading}
            body={home.roadmap.body}
          />
          <Roadmap steps={roadmap} />
        </div>
      </section>

      <section className="v1-section v1-reveal" aria-labelledby="v1-areas-heading">
        <SectionHeading
          id="v1-areas-heading"
          kicker={home.areas.kicker}
          heading={home.areas.heading}
          body={home.areas.body}
        />
        <ActionWheel
          areas={callToAction.areas}
          iconNames={actionAreaIcons}
          centre={callToActionV1.wheelCentre}
        />
        <TextLink href="/call-to-action">{home.areas.link}</TextLink>
      </section>

      <DonateBand />

      <section className="v1-section v1-reveal" aria-labelledby="v1-news-heading">
        <SectionHeading id="v1-news-heading" kicker={home.news.kicker} heading={home.news.heading} />
        <ul className="v1-news">
          {news.items.map(({ slug, title, date, summary }) => (
            <li key={slug}>
              <p className="v1-news-date">
                <time dateTime={date}>{formatDate(date)}</time>
              </p>
              <h3>
                <Link href={`/news/${slug}`}>{title}</Link>
              </h3>
              <p>{summary}</p>
            </li>
          ))}
        </ul>
        <TextLink href="/news">{home.news.link}</TextLink>
      </section>
    </>
  )
}
