import 'server-only'

import type { Payload } from 'payload'

import type { Session, SessionLocation } from '@/payload-types'
import { registrationRoutes, sessionSummary } from '@/utils/sessions'

export type RegistrableSession = { id: number; summary: string }

const locationOf = (session: Session): SessionLocation | undefined =>
  typeof session.location === 'object' ? session.location : undefined

// Whether this site's form takes registrations for a session that is still open.
export const canRegister = (session: Session) => {
  const location = locationOf(session)
  return Boolean(location && registrationRoutes(session, location).some((r) => !r.external))
}

export async function findRegistrableSession(
  payload: Payload,
  value: FormDataEntryValue | null,
): Promise<RegistrableSession | undefined> {
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) return undefined
  const { docs } = await payload.find({
    collection: 'sessions',
    where: { id: { equals: id } },
    depth: 1,
    limit: 1,
    overrideAccess: false,
  })
  const session = docs[0]
  if (!session || !canRegister(session)) return undefined
  return {
    id: session.id,
    summary: sessionSummary({ ...session, locationName: locationOf(session)?.name ?? '' }),
  }
}
