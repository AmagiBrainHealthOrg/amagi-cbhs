import { Calendar, Clock, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { DonateBanner } from '@/components/DonateBanner'
import { Section } from '@/components/Section'
import { countries, type Country, findCountry } from '@/config/countries'
import config from '@/payload.config'
import type { Session, Team } from '@/payload-types'
import { dayLabel, registrationRoutes, timeRange } from '@/utils/sessions'

import type { RouteProps } from '../../_page'
import '../countries.css'

type Props = RouteProps<{ country: string }>

export const generateStaticParams = () => countries.map(({ slug }) => ({ country: slug }))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const country = findCountry((await params).country)
  return country
    ? {
        title: `${country.name} | Caribbean Brain Health Summit`,
        description: country.tagline,
      }
    : {}
}

const bySchedule = (a: Session, b: Session) =>
  (a.day ?? '9').localeCompare(b.day ?? '9') ||
  (a.startTime ?? '99').localeCompare(b.startTime ?? '99') ||
  a.title.localeCompare(b.title)

async function loadCountry(country: Country) {
  const payload = await getPayload({ config })
  const read = { pagination: false, overrideAccess: false } as const
  const { docs: locations } = await payload.find({
    collection: 'session-locations',
    where: { name: { equals: country.name } },
    depth: 0,
    ...read,
  })
  const [sessions, team] = await Promise.all([
    locations[0]
      ? payload.find({
          collection: 'sessions',
          where: { location: { equals: locations[0].id } },
          depth: 1,
          ...read,
        })
      : undefined,
    payload.find({
      collection: 'team',
      where: { country: { in: country.teamCountries } },
      sort: ['order', 'name'],
      depth: 1,
      ...read,
    }),
  ])
  return {
    sessions: (sessions?.docs ?? []).sort(bySchedule),
    team: team.docs,
  }
}

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
        <Link href={`/sessions/${session.slug}`}>{session.title}</Link>
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

export default async function CountryPage({ params }: Props) {
  const country = findCountry((await params).country)
  if (!country) notFound()

  let data: Awaited<ReturnType<typeof loadCountry>> | undefined
  try {
    data = await loadCountry(country)
  } catch (error) {
    console.error(`The ${country.name} page could not load its sessions and team`, error)
  }

  return (
    <>
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

      <nav className="country-tabs" aria-label="Host countries">
        <ul>
          {countries.map(({ slug, name }) => (
            <li key={slug}>
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

      <section
        className="v1-section country-intro"
        aria-label={`About ${country.name}'s contribution`}
      >
        <div className="v1-lead-text">
          {country.intro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <Section
        blockId="programme"
        anchorId="programme"
        background="pale"
        heading="Explore the programme"
        intro={`Browse the confirmed ${country.name} activities below. Some are open to the public; others require registration, selection or an invitation. Check each listing for local time, location and access arrangements before making plans.`}
      >
        {!data ? (
          <p className="form-alert" role="alert">
            The programme is unavailable right now. Please try again later.
          </p>
        ) : (
          data.sessions.length > 0 && (
            <>
              <p className="country-timezone">Times are in {country.timeZone}.</p>
              <ul className="country-sessions">
                {data.sessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </ul>
            </>
          )
        )}
        {country.anchorDay && (
          <aside className="country-anchor-day" aria-label="Anchor Day">
            <h3>Anchor Day leadership roundtable</h3>
            <p>
              <strong>Monday 16 November 2026</strong> 9:30 am–12:00 noon, Jamaica time.
            </p>
            <p>
              Participation by invitation. Practical details are shared directly with invited
              participants.
            </p>
          </aside>
        )}
      </Section>

      <Section blockId="hosts" heading="Local hosts and contributors">
        <div className="v1-text-column">
          {country.hosts && <p>{country.hosts}</p>}
          <p className={country.hosts ? 'v1-muted' : undefined}>
            Each activity listing identifies its host and contributors. These roles are specific to
            the activity; taking part does not automatically imply endorsement by an
            individual&apos;s employer or by another institution.
          </p>
        </div>
      </Section>

      {data && data.team.length > 0 && (
        <Section
          blockId="team"
          anchorId="team"
          background="pale"
          heading="Meet the country team"
          intro={`The people bringing ${country.name}'s contribution together.`}
        >
          <ul className="country-team">
            {data.team.map((member) => (
              <TeamMember key={member.id} member={member} />
            ))}
          </ul>
        </Section>
      )}

      <Section
        blockId="priorities"
        heading="Priorities to develop together"
        intro="The following is an emerging discussion focus for the country team, not an adopted national position. We welcome experience and evidence that can help test and refine it."
      >
        <div className="country-question">
          <p className="v1-kicker">The question</p>
          <p>{country.question}</p>
        </div>
        <dl className="country-priorities">
          <div>
            <dt>Strengths to build on</dt>
            <dd>{country.strengths}</dd>
          </div>
          <div>
            <dt>A possible local next step</dt>
            <dd>{country.nextStep}</dd>
          </div>
          <div>
            <dt>Where regional cooperation could help</dt>
            <dd>{country.regional}</dd>
          </div>
        </dl>
      </Section>

      <Section blockId="take-part" heading="Find your way to take part">
        <ul className="v1-icon-tiles">
          <Card
            index={0}
            icon="users"
            title="Attend"
            body="Choose a suitable event from the listings and follow its access instructions."
            link={{ label: 'View country activities', href: '#programme' }}
          />
          <Card
            index={1}
            icon="hand-heart"
            title="Contribute expertise or practical support"
            body="Tell us what you could offer and which local priority or activity it relates to. A suitable role or speaking opportunity is not guaranteed."
            link={{ label: 'Express interest in this country', href: '/register' }}
          />
          <Card
            index={2}
            icon="megaphone"
            title="Host a Relay activity"
            body="Propose an hour-long activity you or your organisation will organise and lead. Programme inclusion and any support must be confirmed separately."
            link={{ label: 'Propose a Relay activity', href: '/relay' }}
          />
          <Card
            index={3}
            icon="file-text"
            title="Help shape the agenda"
            body="Contribute to the Caribbean Call to Action on Brain Health consultation."
            link={{ label: 'Contribute to the consultation', href: '/call-to-action' }}
          />
        </ul>
        <p className="v1-muted">
          <strong>Stay connected:</strong> express interest in future work if you cannot contribute
          during this November&apos;s programme.
        </p>

        <details className="country-details">
          <summary>Beyond Summit week</summary>
          <p>
            The intention is to carry forward useful priorities, relationships and agreed next
            steps—not only repeat the events. Further work will depend on the people,
            responsibilities, resources and permissions agreed. Expressing interest does not create
            a commitment to organise an activity or join a project.
          </p>
          <p>
            Interested in wider conversations? Explore the{' '}
            <Link href="/summit-week">shared online programme</Link> and{' '}
            <Link href="/countries">other country contributions</Link>. Please use the appropriate
            local service&apos;s contact route for immediate care enquiries; Summit registration is
            not a clinical referral service.
          </p>
        </details>

        <div className="country-about">
          <h3>About this contribution</h3>
          <p>
            These activities form part of the Caribbean Brain Health Summit 2026, convened by Amagi
            Health. Local hosts lead their own agreed activities. For the current regional programme
            and ways to participate, visit <Link href="/">amagisummit.org</Link>.
          </p>
        </div>
      </Section>

      <DonateBanner />
    </>
  )
}
