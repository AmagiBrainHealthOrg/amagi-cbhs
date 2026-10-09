import type { FieldName } from '@/config/airtable'
import type { FormKey } from '@/config/forms'

// SPEC §8.3. Which fields each form asks, in order, and how. The Airtable field each one writes
// to is in src/config/airtable.ts; options for link and select fields come from the base.

export type Control =
  'text' | 'email' | 'tel' | 'url' | 'textarea' | 'date' | 'select' | 'radios' | 'checkboxes'

export type FieldDef = {
  name: FieldName
  label: string
  control: Control
  required?: boolean
  hint?: string
  autoComplete?: string
  placeholder?: string
  /** Takes the full row in the two-column grid. */
  wide?: boolean
  min?: string
  max?: string
  /** Numbered, coloured badges on each option, as on the Call to Action page. */
  numbered?: boolean
  /** Shown, and validated, only while another field holds the choice with this ID. */
  showWhen?: { field: FieldName; choiceId: string }
}

export type FormDefinition = {
  fields: FieldDef[]
  submitLabel: string
  /** Shown above the submit button. */
  notice?: string
}

const name: FieldDef = {
  name: 'name',
  label: 'Name',
  control: 'text',
  required: true,
  autoComplete: 'name',
}
const email: FieldDef = {
  name: 'email',
  label: 'Email',
  control: 'email',
  required: true,
  autoComplete: 'email',
}
const phone: FieldDef = {
  name: 'phone',
  label: 'Phone or WhatsApp',
  control: 'tel',
  autoComplete: 'tel',
  placeholder: '+1 876 555 0123',
  hint: 'Include your country code.',
}
const organisation = (required = false): FieldDef => ({
  name: 'organisation',
  label: 'Organisation',
  control: 'text',
  required,
  autoComplete: 'organization',
})
const role = (required = false): FieldDef => ({
  name: 'role',
  label: 'Role or title',
  control: 'text',
  required,
  autoComplete: 'organization-title',
})
const location = (label = 'Where are you based?'): FieldDef => ({
  name: 'location',
  label,
  control: 'select',
  required: true,
})
const describesYou: FieldDef = {
  name: 'describesYou',
  label: 'Which best describes you?',
  control: 'select',
  required: true,
}
const followUp: FieldDef = {
  name: 'followUp',
  label: 'Staying in touch',
  control: 'checkboxes',
  wide: true,
}

export const formRegistry: Record<FormKey, FormDefinition> = {
  'register-interest': {
    submitLabel: 'Register interest',
    fields: [
      name,
      email,
      phone,
      organisation(),
      role(),
      location(),
      describesYou,
      {
        name: 'engagement',
        label: 'How would you like to be involved?',
        control: 'checkboxes',
        wide: true,
      },
      { name: 'areaOfWork', label: 'Your area of work', control: 'checkboxes', wide: true },
      { name: 'areaOfWorkOther', label: 'Other area of work', control: 'text' },
      {
        name: 'interest',
        label: 'Your interest or potential contribution',
        control: 'textarea',
        wide: true,
      },
      {
        name: 'support',
        label: 'Financial or in-kind support your organisation could offer',
        control: 'textarea',
        wide: true,
      },
      followUp,
    ],
  },
  'cta-consultation': {
    submitLabel: 'Join the consultation',
    notice:
      'Registering your interest in the consultation is not an endorsement of the Call to Action.',
    fields: [
      name,
      email,
      phone,
      organisation(),
      role(true),
      location(),
      describesYou,
      {
        name: 'actionArea',
        label: 'Which action area interests you most?',
        control: 'radios',
        required: true,
        wide: true,
        numbered: true,
      },
      followUp,
    ],
  },
  partner: {
    submitLabel: 'Send',
    fields: [
      name,
      email,
      phone,
      organisation(true),
      role(),
      {
        name: 'website',
        label: 'Website',
        control: 'url',
        required: true,
        autoComplete: 'url',
        placeholder: 'https://',
      },
      location('Where is it based?'),
      { name: 'industry', label: 'Industry', control: 'select', required: true },
      { name: 'industryOther', label: 'Other industry', control: 'text' },
      describesYou,
      {
        name: 'involvement',
        label: "How you'd like to be involved",
        control: 'textarea',
        required: true,
        wide: true,
      },
      followUp,
    ],
  },
  relay: {
    submitLabel: 'Propose activity',
    fields: [
      name,
      email,
      phone,
      organisation(),
      role(),
      describesYou,
      location('Country of the activity'),
      {
        name: 'activityDate',
        label: 'Activity date',
        control: 'date',
        required: true,
        min: '2026-11-16',
        max: '2026-11-22',
        hint: 'Between 16 and 22 November 2026.',
      },
      {
        name: 'activity',
        label: 'Proposed activity',
        control: 'textarea',
        required: true,
        wide: true,
        hint: "What you'd run, who it's for and where.",
      },
      followUp,
    ],
  },
  contact: {
    submitLabel: 'Send message',
    fields: [
      {
        name: 'enquiryType',
        label: "What's it about?",
        control: 'radios',
        required: true,
        wide: true,
      },
      name,
      email,
      phone,
      {
        name: 'outlet',
        label: 'Outlet',
        control: 'text',
        required: true,
        placeholder: 'Publication, station or programme',
        // The base's "Media" choice on Enquiries → Enquiry type.
        showWhen: { field: 'enquiryType', choiceId: 'selD6NwSkMSsug7al' },
      },
      organisation(),
      role(),
      location(),
      { name: 'message', label: 'Message', control: 'textarea', required: true, wide: true },
      followUp,
    ],
  },
}
