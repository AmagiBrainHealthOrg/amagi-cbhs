import type { FieldName } from '@/config/airtable'
import type { FieldOption } from '@/utils/airtable'

import type { FieldDef } from './registry'

// Shared by the browser and the server action, so both give the same messages (SPEC §8.2).

export type ResolvedField = FieldDef & { options?: FieldOption[] }
export type Values = Partial<Record<FieldName, string | string[]>>
export type FieldErrors = Partial<Record<FieldName, string>>

export const HONEYPOT = 'homepage'

const MAX_TEXT = 200
const MAX_LONG_TEXT = 5000
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?[\d\s().-]{6,24}$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

const many = (control: FieldDef['control']) => control === 'checkboxes'

export function readValues(fields: ResolvedField[], form: FormData): Values {
  const values: Values = {}
  for (const { name, control } of fields) {
    const raw = form.getAll(name).filter((v): v is string => typeof v === 'string')
    values[name] = many(control) ? raw.map((v) => v.trim()).filter(Boolean) : (raw[0] ?? '').trim()
  }
  return values
}

export function isVisible(field: FieldDef, values: Values, fields: ResolvedField[]): boolean {
  if (!field.showWhen) return true
  const { field: other, choiceId } = field.showWhen
  const option = fields.find((f) => f.name === other)?.options?.find((o) => o.id === choiceId)
  return Boolean(option) && values[other] === option?.value
}

// A web address without a scheme gets https://, as people often type "example.com".
export const normaliseUrl = (value: string) =>
  value && !/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? `https://${value}` : value

function check(field: ResolvedField, value: string | string[]): string | undefined {
  const list = Array.isArray(value) ? value : value ? [value] : []
  if (list.length === 0) {
    if (!field.required) return undefined
    return ['select', 'radios', 'checkboxes'].includes(field.control)
      ? 'Choose an option'
      : 'This field is required'
  }

  if (field.options) {
    const allowed = new Set(field.options.map((o) => o.value))
    return list.every((v) => allowed.has(v)) ? undefined : 'Choose one of the options'
  }

  const text = list[0]
  switch (field.control) {
    case 'email':
      return EMAIL.test(text) ? undefined : 'Enter an email address like name@example.com'
    case 'tel':
      return PHONE.test(text) ? undefined : 'Enter a phone number like +1 876 555 0123'
    case 'url':
      try {
        const url = new URL(normaliseUrl(text))
        return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.')
          ? undefined
          : 'Enter a web address like https://example.org'
      } catch {
        return 'Enter a web address like https://example.org'
      }
    case 'date':
      if (!DATE.test(text)) return 'Enter a date'
      if ((field.min && text < field.min) || (field.max && text > field.max)) {
        return field.hint ?? 'Choose a date in the allowed range'
      }
      return undefined
    case 'textarea':
      return text.length > MAX_LONG_TEXT ? `Keep this under ${MAX_LONG_TEXT} characters` : undefined
    default:
      return text.length > MAX_TEXT ? `Keep this under ${MAX_TEXT} characters` : undefined
  }
}

export function validate(fields: ResolvedField[], values: Values): FieldErrors {
  const errors: FieldErrors = {}
  for (const field of fields) {
    if (!isVisible(field, values, fields)) continue
    const error = check(field, values[field.name] ?? '')
    if (error) errors[field.name] = error
  }
  return errors
}
