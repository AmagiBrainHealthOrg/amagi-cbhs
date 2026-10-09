import 'server-only'

import type { Payload } from 'payload'

import type { FormKey } from '@/config/forms'
import { confirmationEmail } from '@/emails/confirmation'
import { syncAlertEmail } from '@/emails/syncAlert'
import { env } from '@/env'

export async function sendConfirmation(
  payload: Payload,
  form: FormKey,
  to: string,
  name?: string,
): Promise<void> {
  const { thankYou } = await payload.findGlobal({ slug: 'forms', depth: 0 })
  const copy = thankYou?.find((entry) => entry.form === form)
  const email = confirmationEmail({
    name,
    heading: copy?.heading ?? 'Thank you',
    body: copy?.body,
  })
  // Always to the person who sent the form, test mode included (decided 9 October 2026).
  await payload.sendEmail({ to, ...email })
}

export async function sendSyncAlert(
  payload: Payload,
  submission: { id: number; form: string },
  error: string,
): Promise<void> {
  if (!env.SYNC_ALERT_TO) {
    payload.logger.warn(`No sync alert for submission ${submission.id}: SYNC_ALERT_TO is not set`)
    return
  }
  const adminUrl = `${env.NEXT_PUBLIC_SITE_URL}/admin/collections/form-submissions/${submission.id}`
  await payload.sendEmail({
    to: env.SYNC_ALERT_TO,
    ...syncAlertEmail({ ...submission, error, adminUrl }),
  })
}
