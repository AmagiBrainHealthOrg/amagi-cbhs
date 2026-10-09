'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { getPayload } from 'payload'

import { formOptions, type FormKey } from '@/config/forms'
import { getResolvedForm } from '@/lib/forms'
import { allowSubmission } from '@/lib/rateLimit'
import { syncSubmission } from '@/lib/syncSubmission'
import config from '@/payload.config'
import { isLive } from '@/utils/site'
import { UTM_KEYS } from '@/utils/utm'

import {
  type FieldErrors,
  HONEYPOT,
  isVisible,
  normaliseUrl,
  readValues,
  validate,
  type Values,
} from './validate'

export type FormState = {
  errors?: FieldErrors
  formError?: string
  /** What was sent, so a rejected form keeps its answers. */
  values?: Values
}

const isFormKey = (key: string): key is FormKey => formOptions.some(({ value }) => value === key)

const clientIp = async () => {
  const list = await headers()
  return list.get('x-forwarded-for')?.split(',')[0]?.trim() || list.get('x-real-ip') || 'unknown'
}

const thankYouUrl = (key: FormKey, params: Record<string, string | undefined>) => {
  const query = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString()
  return `/thank-you/${key}${query ? `?${query}` : ''}`
}

// SPEC §8.2: validate → rate limit → save → redirect, then sync to Airtable after the response.
export async function submitForm(
  key: string,
  _state: FormState,
  form: FormData,
): Promise<FormState> {
  if (!isFormKey(key)) return { formError: 'This form is not available.' }

  // Bots fill the hidden field. They get the thank-you page and nothing is saved.
  if (form.get(HONEYPOT)) redirect(thankYouUrl(key, {}))

  const payload = await getPayload({ config })

  let fields
  try {
    fields = await getResolvedForm(key)
  } catch (error) {
    console.error(`Form ${key} could not load its fields`, error)
    return { formError: 'The form is unavailable right now. Please try again later.' }
  }

  const values = readValues(fields, form)
  const errors = validate(fields, values)
  if (Object.keys(errors).length > 0) return { errors, values }

  if (!(await allowSubmission(payload, await clientIp()))) {
    return {
      formError: "You've sent several forms in a short time. Please wait 10 minutes and try again.",
      values,
    }
  }

  const data: Values = {}
  for (const field of fields) {
    const value = values[field.name]
    if (!isVisible(field, values, fields) || !value || value.length === 0) continue
    data[field.name] = field.control === 'url' ? normaliseUrl(value as string) : value
  }
  const labelOf = (name: 'location' | 'describesYou') =>
    fields.find((f) => f.name === name)?.options?.find((o) => o.value === data[name])?.label

  const utm = (key: (typeof UTM_KEYS)[number]) => {
    const value = form.get(key)
    return typeof value === 'string' ? value.trim().slice(0, 500) || undefined : undefined
  }

  const territory = labelOf('location')
  const audienceType = labelOf('describesYou')
  const submission = await payload.create({
    collection: 'form-submissions',
    data: {
      form: key,
      data: data as Record<string, string | string[]>,
      territory,
      audienceType,
      utm: {
        source: utm('utm_source'),
        medium: utm('utm_medium'),
        campaign: utm('utm_campaign'),
        term: utm('utm_term'),
        content: utm('utm_content'),
      },
      isTest: !isLive(),
      airtableSyncStatus: 'pending',
    },
  })

  after(() => syncSubmission(payload, submission.id))

  redirect(thankYouUrl(key, { territory, audience_type: audienceType }))
}
