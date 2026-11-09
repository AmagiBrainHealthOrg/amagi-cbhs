import { describe, expect, it } from 'vitest'

import { formRegistry } from '@/forms/registry'
import { isVisible, normaliseUrl, readValues, type ResolvedField, validate } from '@/forms/validate'

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

  it('asks every Relay requirement once, with the acknowledgement first and required', () => {
    const { fields } = formRegistry.relay
    const names = fields.map((f) => f.name)
    expect(new Set(names).size).toBe(names.length)
    for (const name of [
      'organisation',
      'name',
      'email',
      'phone',
      'location',
      'city',
      'activityTitle',
      'activity',
      'activityTypes',
      'activityTypeOther',
      'deliveryFormat',
      'activityDate',
      'activityTime',
      'timeZone',
      'venueStatus',
      'venue',
      'estimatedAttendance',
      'attendanceAccess',
      'attendanceGroup',
      'registrationNeeded',
      'support',
      'publicListing',
      'postActivity',
    ]) {
      expect(names).toContain(name)
    }
    expect(fields[0]).toMatchObject({
      name: 'acknowledgement',
      control: 'checkbox',
      required: true,
    })
    expect(validate([fields[0]], {})).toEqual({ acknowledgement: 'Tick this box to continue' })
    expect(validate([fields[0]], { acknowledgement: 'true' })).toEqual({})
  })

  it('asks for the other activity type only when Other is ticked', () => {
    const other = { value: 'Other — please specify', label: 'Other', id: 'selz6do3qZRDLnp0o' }
    const talk = { value: 'Talk', label: 'Talk', id: 'selTalk' }
    const relay: ResolvedField[] = formRegistry.relay.fields
      .filter((f) => f.name === 'activityTypes' || f.name === 'activityTypeOther')
      .map((f) => (f.name === 'activityTypes' ? { ...f, options: [talk, other] } : f))
    expect(validate(relay, { activityTypes: ['Talk'] })).toEqual({})
    expect(validate(relay, { activityTypes: ['Talk', other.value] })).toEqual({
      activityTypeOther: 'This field is required',
    })
  })

  it('asks for the venue only once it is confirmed', () => {
    const { fields } = formRegistry.relay
    const status = {
      ...fields.find((f) => f.name === 'venueStatus')!,
      options: [
        { value: 'Confirmed', label: 'Confirmed', id: 'selMs0xEgvd4dgWEI' },
        { value: 'Not yet confirmed', label: 'Not yet confirmed', id: 'selJuzHbluyY4hBmq' },
      ],
    }
    const venue = fields.find((f) => f.name === 'venue')!
    expect(validate([status, venue], { venueStatus: 'Not yet confirmed' })).toEqual({})
    expect(validate([status, venue], { venueStatus: 'Confirmed' })).toEqual({
      venue: 'This field is required',
    })
  })

  it('adds https:// to a bare web address', () => {
    expect(normaliseUrl('example.org')).toBe('https://example.org')
    expect(normaliseUrl('http://example.org')).toBe('http://example.org')
  })

  it('reads checkboxes as lists', () => {
    const followUp = formRegistry.contact.fields.find((f) => f.name === 'followUp')!
    const data = form([
      ['followUp', 'A'],
      ['followUp', 'B'],
      ['consentShareStory', 'on'],
    ])
    expect(readValues([followUp], data)).toEqual({ followUp: ['A', 'B'] })
  })

  it('asks no health questions', () => {
    const labels = Object.values(formRegistry).flatMap((def) => def.fields.map((f) => f.label))
    expect(labels.join(' ')).not.toMatch(/diagnos|symptom|medical|health history|condition/i)
  })
})
