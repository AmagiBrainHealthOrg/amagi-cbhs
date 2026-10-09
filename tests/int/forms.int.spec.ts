import { describe, expect, it } from 'vitest'

import { formRegistry } from '@/forms/registry'
import {
  isVisible,
  normaliseUrl,
  readConsents,
  readValues,
  type ResolvedField,
  validate,
} from '@/forms/validate'

const media = { value: 'Media', label: 'Media', id: 'selD6NwSkMSsug7al' }
const fields: ResolvedField[] = formRegistry.contact.fields.map((field) =>
  field.name === 'enquiryType'
    ? { ...field, options: [{ value: 'General', label: 'General', id: 'selG' }, media] }
    : field.name === 'location'
      ? { ...field, options: [{ value: 'recJ', label: 'Jamaica' }] }
      : field,
)

const form = (entries: [string, string][]) => {
  const data = new FormData()
  for (const [key, value] of entries) data.append(key, value)
  return data
}

describe('form validation', () => {
  it('requires the required fields, with one message per field', () => {
    expect(validate(fields, {})).toEqual({
      enquiryType: 'Choose an option',
      name: 'This field is required',
      email: 'This field is required',
      location: 'Choose an option',
      message: 'This field is required',
    })
  })

  it('accepts a complete general enquiry and skips the hidden outlet', () => {
    const values = {
      enquiryType: 'General',
      name: 'Testy Testerson',
      email: 'testy@example.com',
      location: 'recJ',
      message: 'Hello',
    }
    expect(validate(fields, values)).toEqual({})
    expect(
      isVisible(
        fields.find((f) => f.name === 'outlet')!,
        values,
        fields,
      ),
    ).toBe(false)
  })

  it('requires the outlet only for media enquiries', () => {
    const values = {
      enquiryType: 'Media',
      name: 'A',
      email: 'a@example.com',
      location: 'recJ',
      message: 'Hi',
    }
    expect(validate(fields, values)).toEqual({ outlet: 'This field is required' })
  })

  it('rejects options the base does not have, bad emails and bad phones', () => {
    const errors = validate(fields, {
      enquiryType: 'General',
      name: 'A',
      email: 'not-an-email',
      phone: 'call me',
      location: 'recForged',
      message: 'Hi',
    })
    expect(errors).toEqual({
      email: 'Enter an email address like name@example.com',
      phone: 'Enter a phone number like +1 876 555 0123',
      location: 'Choose one of the options',
    })
  })

  it('limits the relay date to Summit week', () => {
    const date = formRegistry.relay.fields.find((f) => f.name === 'activityDate')!
    expect(validate([date], { activityDate: '2026-11-18' })).toEqual({})
    expect(validate([date], { activityDate: '2026-12-01' })).toEqual({
      activityDate: 'Between 16 and 22 November 2026.',
    })
  })

  it('adds https:// to a bare web address', () => {
    expect(normaliseUrl('example.org')).toBe('https://example.org')
    expect(normaliseUrl('http://example.org')).toBe('http://example.org')
  })

  it('reads checkboxes as lists and consents as independent booleans', () => {
    const followUp = formRegistry.contact.fields.find((f) => f.name === 'followUp')!
    const data = form([
      ['followUp', 'A'],
      ['followUp', 'B'],
      ['consentShareStory', 'on'],
    ])
    expect(readValues([followUp], data)).toEqual({ followUp: ['A', 'B'] })
    expect(readConsents(data)).toEqual({ contact: false, publicName: false, shareStory: true })
  })

  it('asks no health questions', () => {
    const labels = Object.values(formRegistry).flatMap((def) => def.fields.map((f) => f.label))
    expect(labels.join(' ')).not.toMatch(/diagnos|symptom|medical|health history|condition/i)
  })
})
