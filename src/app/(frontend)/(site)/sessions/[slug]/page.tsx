import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { DonateBanner } from '@/components/DonateBanner'
import { Form } from '@/components/forms/Form'
import { formRegistry } from '@/forms/registry'
import type { ResolvedField } from '@/forms/validate'
import { getResolvedForm } from '@/lib/forms'
import { canRegister } from '@/lib/sessions'
import config from '@/payload.config'
import { whenLabel, zoneLabel } from '@/utils/sessions'

import { RefreshRouteOnSave } from '../../../RefreshRouteOnSave'
import { previewUser, type RouteProps } from '../../_page'

type Props = RouteProps<{ slug: string }>

const FORM = 'session-registration'

// Each page renders on its first visit, then serves from cache until a publish revalidates it.
export const generateStaticParams = () => []

const findSession = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const user = await previewUser()
  const { docs } = await payload.find({
    collection: 'sessions',
    where: { slug: { equals: slug } },
    draft: Boolean(user),
    limit: 1,
    depth: 1,
    overrideAccess: false,
    user,
  })
  return { session: docs[0], draft: Boolean(user) }
})

const resolve = async ({ params }: Props) => findSession((await params).slug)

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { session } = await resolve(props)
  if (!session) return {}
  return {
    title: `${session.title} | Caribbean Brain Health Summit`,
    description: session.description || whenLabel(session),
  }
}

export default async function SessionPage(props: Props) {
  const { session, draft } = await resolve(props)
  const location = typeof session?.location === 'object' ? session.location : undefined
  if (!session || !location) notFound()
  const theme = typeof session.theme === 'object' ? session.theme : undefined
  const open = canRegister(session)

  let fields: ResolvedField[] | undefined
  if (open) {
    try {
      fields = await getResolvedForm(FORM)
    } catch (error) {
      console.error(`Form ${FORM} could not load its fields from Airtable`, error)
    }
  }

  return (
    <>
      {draft && <RefreshRouteOnSave />}
      <article className="page-section news-article session-page">
        <Link className="back-link" href="/summit-week">
          <ArrowLeft aria-hidden="true" /> Summit Week
        </Link>
        <p className="news-meta">{[location.name, theme?.name].filter(Boolean).join(' · ')}</p>
        <h1>{session.title}</h1>
        <dl className="session-details">
          <div>
            <dt>When</dt>
            <dd>
              {whenLabel(session)}
              {session.startTime && `, ${zoneLabel(location.name, location.timeZone)}`}
            </dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>
              {location.online
                ? 'Online'
                : [session.venue, location.city, location.name].filter(Boolean).join(', ')}
            </dd>
          </div>
        </dl>
        {session.description && <p>{session.description}</p>}

        <section className="session-register" aria-labelledby="register-heading">
          <h2 id="register-heading">Register</h2>
          {location.online && session.zoomUrl && session.registrationOpen !== false ? (
            <a
              className="button button-blue"
              href={session.zoomUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-journey="session_registration"
              data-action="register_online"
              data-destination-type="external"
            >
              Register on Zoom
            </a>
          ) : !open ? (
            <p>Registration for this session has closed.</p>
          ) : fields ? (
            <Form
              formKey={FORM}
              fields={fields}
              submitLabel={formRegistry[FORM].submitLabel}
              idPrefix="session"
              hidden={{ session: String(session.id) }}
            />
          ) : (
            <p className="form-alert" role="alert">
              This form is unavailable right now. Please try again later.
            </p>
          )}
        </section>
      </article>
      <DonateBanner />
    </>
  )
}
