import { Calendar, Clock, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { DonateBanner } from '@/components/DonateBanner'
import { LinkedText } from '@/components/LinkedText'
import { Section } from '@/components/Section'
import { countryTeams } from '@/config/countryTeams'
import { getCountries } from '@/lib/countries'
import { getGlobal } from '@/lib/globals'
import config from '@/payload.config'
import type { Country, Session, Team } from '@/payload-types'
import { splitParagraphs } from '@/utils/paragraphs'
import { dayLabel, registrationRoutes, timeRange } from '@/utils/sessions'

import { RefreshRouteOnSave } from '../../../RefreshRouteOnSave'
import { previewUser, type RouteProps } from '../../_page'
import '../countries.css'

type Props = RouteProps<{ country: string }>

// TODO: the team sections are hidden for now (10 November 2026). Set true to bring them back.
const SHOW_TEAM = false

// Each page renders on its first visit, then serves from cache until a publish revalidates it.
export const generateStaticParams = () => []

const findCountry = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const user = await previewUser()
  const { docs } = await payload.find({
    collection: 'countries',
    where: { slug: { equals: slug } },
    draft: Boolean(user),
    limit: 1,
    depth: 0,
    overrideAccess: false,
    user,
  })
  return { country: docs[0], draft: Boolean(user) }
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await findCountry((await params).country)
  return country
    ? { title: `${country.name} | Caribbean Brain Health Summit`, description: country.tagline }
    : {}
}

const bySchedule = (a: Session, b: Session) =>
  (a.day ?? '9').localeCompare(b.day ?? '9') ||
  (a.startTime ?? '99').localeCompare(b.startTime ?? '99') ||
  a.title.localeCompare(b.title)

async function loadDetails(country: Country) {
  const payload = await getPayload({ config })
  const read = { pagination: false, overrideAccess: false } as const
  const location = typeof country.location === 'number' ? country.location : country.location.id
  const [sessions, team] = await Promise.all([
    payload.find({
      collection: 'sessions',
      where: { location: { equals: location } },
      depth: 1,
      ...read,
    }),
    SHOW_TEAM
      ? payload.find({
          collection: 'team',
          where: { country: { in: countryTeams[country.slug] ?? [country.name] } },
          sort: ['order', 'name'],
          depth: 1,
          ...read,
        })
      : undefined,
  ])
  return { sessions: sessions.docs.sort(bySchedule), team: team?.docs ?? [] }
}

const withCountry = (text: string | null | undefined, name: string) =>
  text?.replaceAll('{country}', name)

function SessionCard({ session }: { session: Session }) {
  const location = typeof session.location === 'object' ? session.location : undefined
  const theme = typeof session.theme === 'object' ? session.theme : undefined
  const routes = location ? registrationRoutes(session, location) : []
  return (
    <li className={theme ? `schedule-theme-${theme.colour}` : undefined}>
      {theme && <p className="country-chip">{theme.name}</p>}
      <p className="country-session-when">
        <span>
          <Calendar aria-hidden="true" /> {session.day ? dayLabel(session.day) : 'Date TBC'}
        </span>
        <span>
          <Clock aria-hidden="true" />{' '}
          {session.startTime ? timeRange(session.startTime, session.endTime) : 'Time TBC'}
        </span>
      </p>
      <h3>
        {routes.length > 0 ? (
          <Link href={`/sessions/${session.slug}`}>{session.title}</Link>
        ) : (
          session.title
        )}
      </h3>
      {session.venue && (
        <p className="country-session-venue">
          <MapPin aria-hidden="true" /> {session.venue}
        </p>
      )}
      {session.description && <p className="country-session-body">{session.description}</p>}
      {routes.length > 0 && (
        <div className="country-session-actions">
          {routes.map((route) => (
            <Button
              key={route.href}
              href={route.href}
              variant="secondary"
              journey="participate"
              action="session_register"
            >
              {route.label ?? 'Register'}
            </Button>
          ))}
        </div>
      )}
    </li>
  )
}

function TeamMember({ member }: { member: Team }) {
  const photo = typeof member.photo === 'object' && member.photo?.url ? member.photo : undefined
  return (
    <li>
      {photo && (
        <Image
          className="country-team-photo"
          src={photo.url!}
          alt=""
          width={photo.width ?? 640}
          height={photo.height ?? 640}
          sizes="180px"
        />
      )}
      <h3>{member.name}</h3>
      {member.role && <p>{member.role}</p>}
    </li>
  )
}

function Paragraphs({ text }: { text?: string | null }) {
  return splitParagraphs(text).map((paragraph) => (
    <p key={paragraph}>
      <LinkedText text={paragraph} />
    </p>
  ))
}

export default async function CountryPage({ params }: Props) {
  const { country, draft } = await findCountry((await params).country)
  if (!country) notFound()

  const [copy, countries] = await Promise.all([getGlobal('country-pages'), getCountries()])
  let details: Awaited<ReturnType<typeof loadDetails>> | undefined
  try {
    details = await loadDetails(country)
  } catch (error) {
    console.error(`The ${country.name} page could not load its sessions`, error)
  }

  const { programme, anchorDay, hosts, priorities, takePart, beyond, about } = copy
  const cards = takePart?.cards ?? []

  return (
    <>
      {draft && <RefreshRouteOnSave />}
      <section className="page-hero country-hero">
        <div className="page-hero-inner">
          <Breadcrumbs
            label="Breadcrumb"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Countries', href: '/countries' },
              { label: country.name },
            ]}
          />
          <p className="page-kicker">{country.name}</p>
          <h1>{country.tagline}</h1>
        </div>
      </section>

      {countries.length > 1 && (
        <nav className="country-tabs" aria-label="Host countries">
          <ul>
            {countries.map(({ id, slug, name }) => (
              <li key={id}>
                <Link
                  href={`/countries/${slug}`}
                  aria-current={slug === country.slug ? 'page' : undefined}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <section
        className="v1-section country-intro"
        aria-label={`About ${country.name}'s contribution`}
      >
        <div className="v1-lead-text">
          <Paragraphs text={country.intro} />
        </div>
      </section>

      <Section
        blockId="programme"
        anchorId="programme"
        background="pale"
        heading={programme?.heading}
        intro={withCountry(programme?.intro, country.name)}
      >
        {!details ? (
          <p className="form-alert" role="alert">
            The programme is unavailable right now. Please try again later.
          </p>
        ) : (
          details.sessions.length > 0 && (
            <>
              {programme?.timeZoneNote && (
                <p className="country-timezone">
                  {withCountry(programme.timeZoneNote, country.name)}
                </p>
              )}
              <ul className="country-sessions">
                {details.sessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </ul>
            </>
          )
        )}
        {country.anchorDay && anchorDay?.heading && (
          <aside className="country-anchor-day" aria-label={anchorDay.heading}>
            <h3>{anchorDay.heading}</h3>
            {anchorDay.when && (
              <p>
                <strong>{anchorDay.when}</strong>
              </p>
            )}
            {anchorDay.body && <p>{anchorDay.body}</p>}
          </aside>
        )}
      </Section>

      <Section blockId="hosts" heading={hosts?.heading}>
        <div className="v1-text-column">
          <Paragraphs text={country.hosts} />
          {hosts?.note && <p className={country.hosts ? 'v1-muted' : undefined}>{hosts.note}</p>}
        </div>
      </Section>

      {details && details.team.length > 0 && (
        <Section
          blockId="team"
          anchorId="team"
          background="pale"
          heading="Meet the country team"
          intro={`The people bringing ${country.name}'s contribution together.`}
        >
          <ul className="country-team">
            {details.team.map((member) => (
              <TeamMember key={member.id} member={member} />
            ))}
          </ul>
        </Section>
      )}

      <Section blockId="priorities" heading={priorities?.heading} intro={priorities?.intro}>
        <div className="country-question">
          {priorities?.questionLabel && <p className="v1-kicker">{priorities.questionLabel}</p>}
          <p>{country.priorities.question}</p>
        </div>
        <dl className="country-priorities">
          <div>
            <dt>{priorities?.strengthsLabel}</dt>
            <dd>{country.priorities.strengths}</dd>
          </div>
          <div>
            <dt>{priorities?.nextStepLabel}</dt>
            <dd>{country.priorities.nextStep}</dd>
          </div>
          <div>
            <dt>{priorities?.regionalLabel}</dt>
            <dd>{country.priorities.regional}</dd>
          </div>
        </dl>
      </Section>

      <Section blockId="take-part" heading={takePart?.heading}>
        {cards.length > 0 && (
          <ul className="v1-icon-tiles">
            {cards.map((card, index) => (
              <Card
                key={card.id ?? index}
                index={index}
                icon={card.icon}
                title={card.title}
                body={card.body}
                link={{ label: card.linkLabel, href: card.linkHref }}
              />
            ))}
          </ul>
        )}
        {takePart?.stayConnected && (
          <p className="v1-muted">
            {takePart.stayConnectedLabel && <strong>{takePart.stayConnectedLabel}</strong>}{' '}
            {takePart.stayConnected}
          </p>
        )}

        {beyond?.heading && beyond.body && (
          <details className="country-details">
            <summary>{beyond.heading}</summary>
            <Paragraphs text={beyond.body} />
          </details>
        )}

        {about?.body && (
          <div className="country-about">
            {about.heading && <h3>{about.heading}</h3>}
            <Paragraphs text={about.body} />
          </div>
        )}
      </Section>

      <DonateBanner />
    </>
  )
}
