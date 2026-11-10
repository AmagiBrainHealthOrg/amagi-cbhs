import { worldCountries } from '@/config/worldCountries'

import type { FieldDef, FormDefinition, FormSection } from './registry'

// The PLADRR Jamaica 2027 expression of interest (Ishtar's copy, 10 November 2026). "Main
// reason" picks one route (C to G); each route's fields show, and are validated and saved, only
// while it is chosen. Choice IDs are from the PLADRR expressions of interest table.

const MAIN_REASON = 'mainReason'
const route = {
  scientific: 'sel1jL5rYf1TTVcNH',
  stakeholder: 'selJenEnaVSkHUtVH',
  expertise: 'selTy89TeA4VCCskk',
  publicInfo: 'selHqDc2XYRauyv84',
  support: 'sel0INC2rQSAC3dRx',
} as const
const PERSPECTIVE_OTHER = 'selOX7b3kWWn4MMi8'
const ALL_THREE_DAYS = 'selLRPxWFiCBeASeV'
const NO_SUPPORT = 'selh0loKFIKcfA2uR'
const ALREADY_INVITED_YES = 'selOb9mzuxfbn06zi'

const answered = { field: MAIN_REASON, answered: true } as const

const onRoute = (section: keyof typeof route, fields: FieldDef[]): FieldDef[] =>
  fields.map((field) => ({
    ...field,
    section,
    showWhen: field.showWhen ?? { field: MAIN_REASON, choiceId: route[section] },
  }))

const capacityQuestion = (name: FieldDef['name'], label: string): FieldDef => ({
  name,
  label,
  control: 'radios',
  required: true,
  wide: true,
})

const aboutYou: FieldDef[] = [
  { name: 'name', label: 'Full name', control: 'text', required: true, autoComplete: 'name' },
  {
    name: 'email',
    label: 'Email address',
    control: 'email',
    required: true,
    autoComplete: 'email',
    hint: 'Please use an address at which we can contact you. A university or organisational address is not required.',
  },
  {
    name: 'country',
    label: 'Current country or territory of residence',
    control: 'text',
    required: true,
    autoComplete: 'country-name',
    suggestions: worldCountries,
  },
  {
    name: 'organisation',
    label: 'Organisation, institution or independent affiliation',
    control: 'text',
    required: true,
    autoComplete: 'organization',
    hint: 'You may write "Independent" or "Not currently affiliated".',
  },
  {
    name: 'role',
    label: 'Current role or area of work',
    control: 'text',
    required: true,
    wide: true,
    hint: 'For example, your research field, professional role, community work or other relevant experience.',
  },
  {
    name: MAIN_REASON,
    label: 'What is your main reason for contacting us?',
    control: 'radios',
    required: true,
    wide: true,
  },
].map((field) => ({ ...field, section: 'about' }) as FieldDef)

const scientific = onRoute('scientific', [
  {
    name: 'perspectives',
    label: 'Which perspectives would you bring?',
    control: 'checkboxes',
    required: true,
    wide: true,
  },
  {
    name: 'perspectiveOther',
    label: 'Please specify your other perspective',
    control: 'text',
    required: true,
    wide: true,
    reveal: true,
    showWhen: { field: 'perspectives', choiceId: PERSPECTIVE_OTHER },
  },
  {
    name: 'careerStage',
    label: 'How would you describe your current career stage?',
    control: 'radios',
    required: true,
    wide: true,
  },
  {
    name: 'caribbeanConnection',
    label: 'What connection does your work or experience have with the Caribbean?',
    control: 'textarea',
    wide: true,
    wordLimit: 75,
    hint: 'You may describe work, research, community experience or diaspora connections. You do not need to provide nationality, ethnicity or immigration information.',
  },
  {
    name: 'relevantWork',
    label: 'Briefly describe your work or experience relevant to this meeting.',
    control: 'textarea',
    required: true,
    wide: true,
    wordLimit: 150,
  },
  {
    name: 'profile',
    label: 'Relevant profile or website',
    control: 'url',
    wide: true,
    hint: 'For example, an institutional profile, ORCID, professional website or another relevant link. A profile link is not required for consideration.',
  },
  {
    name: 'workingThemes',
    label: 'Which working themes are most relevant to your contribution?',
    control: 'checkboxes',
    required: true,
    wide: true,
    maxSelections: 2,
    hint: 'Preferences help us plan discussions. They do not assign you permanently to a working group.',
  },
  {
    name: 'clarifyQuestion',
    label:
      'What research or policy question would you particularly like this meeting to help clarify?',
    control: 'textarea',
    required: true,
    wide: true,
    wordLimit: 100,
  },
  {
    name: 'contribution',
    label:
      'What experience, methods or perspective could you contribute to the working discussions or draft outputs?',
    control: 'textarea',
    required: true,
    wide: true,
    wordLimit: 100,
  },
  {
    name: 'resources',
    label:
      'Are there publicly describable studies, policy resources, methods or collaborations the organisers should know about?',
    control: 'textarea',
    wide: true,
    wordLimit: 100,
    hint: 'Do not upload participant data, confidential documents or information you are not authorised to share. Identifying a resource does not grant access to it or commit its institution to participate.',
  },
  {
    name: 'canAttend',
    label: 'If offered a place, could you attend the planned three-day meeting in Kingston?',
    control: 'radios',
    required: true,
    wide: true,
  },
  {
    name: 'availability',
    label: 'Please indicate your likely availability or alternative contribution.',
    control: 'textarea',
    wide: true,
    reveal: true,
    wordLimit: 75,
    hint: 'Remote participation in the full working meeting is not currently promised.',
    showWhen: { field: 'canAttend', choiceId: ALL_THREE_DAYS, not: true },
  },
  {
    name: 'supportNeeded',
    label: 'Would you need financial or practical support to participate?',
    control: 'checkboxes',
    wide: true,
    exclusiveChoiceId: NO_SUPPORT,
    hint: 'This identifies potential needs; it is not a funding application or an assurance of support.',
  },
  {
    name: 'privateContact',
    label:
      'Would you like the organisers to contact you privately about access or participation arrangements?',
    control: 'radios',
    wide: true,
    hint: 'You do not need to describe a disability, health condition or other sensitive circumstances in this form.',
  },
  {
    name: 'alreadyInvited',
    label: 'Have you already received an individual invitation to PLADRR Jamaica?',
    control: 'radios',
    required: true,
    wide: true,
    flag: { choiceId: ALREADY_INVITED_YES, field: 'organiserReview' },
  },
])

const stakeholder = onRoute('stakeholder', [
  {
    name: 'stakeholderPerspective',
    label: 'What perspective would you bring to the dialogue?',
    control: 'textarea',
    required: true,
    wide: true,
    wordLimit: 100,
  },
  {
    name: 'stakeholderQuestion',
    label: 'What priority question or implementation issue would you like the dialogue to examine?',
    control: 'textarea',
    required: true,
    wide: true,
    wordLimit: 100,
  },
  {
    name: 'stakeholderAttend',
    label:
      'Would you be interested in attending an in-person stakeholder dialogue in Kingston during the planned meeting?',
    control: 'radios',
    required: true,
    wide: true,
    hint: 'The specific programme and participation arrangements are being finalised.',
  },
  capacityQuestion('stakeholderCapacity', 'In what capacity would you participate?'),
  {
    name: 'approvalNotes',
    label:
      'Is there anything the organisers should know about organisational approval or participation arrangements?',
    control: 'textarea',
    wide: true,
    wordLimit: 75,
    hint: 'Please do not include confidential correspondence or sensitive personal information.',
  },
])

const expertise = onRoute('expertise', [
  {
    name: 'expertise',
    label: 'What expertise or contribution would you like to discuss?',
    control: 'textarea',
    required: true,
    wide: true,
    wordLimit: 150,
  },
  {
    name: 'expertiseTheme',
    label: 'Which research theme or practical question does it relate to?',
    control: 'textarea',
    required: true,
    wide: true,
    wordLimit: 100,
  },
  capacityQuestion('expertiseCapacity', 'In what capacity are you making this enquiry?'),
])

const support = onRoute('support', [
  {
    name: 'supportType',
    label: 'What type of support would you like to explore?',
    control: 'checkboxes',
    required: true,
    wide: true,
  },
  {
    name: 'supportDescription',
    label: 'Please briefly describe what you would like to discuss.',
    control: 'textarea',
    required: true,
    wide: true,
    wordLimit: 150,
    hint: 'This is an enquiry, not a financial commitment. Please do not provide banking or payment details.',
  },
  capacityQuestion('supportCapacity', 'In what capacity are you making this enquiry?'),
])

const ending: FieldDef[] = [
  {
    name: 'anythingElse',
    label: 'Is there anything else you would like us to know?',
    control: 'textarea',
    wide: true,
    wordLimit: 100,
    hint: 'Please do not include private health information, confidential material or third-party contact details.',
  },
  {
    name: 'eoiAcknowledged',
    label:
      'I understand that this is an expression of interest, not confirmation of attendance, a speaking role, funding or institutional partnership. Any continuing work or commitment would require separate agreement.',
    control: 'checkbox',
    required: true,
    wide: true,
  },
  {
    name: 'privacyAcknowledged',
    label:
      'I have read the privacy notice and understand how my information will be used for this enquiry.',
    control: 'checkbox',
    required: true,
    wide: true,
    before:
      'We will use the information you provide to review and respond to your PLADRR enquiry and organise the relevant participation or updates. Please read the [privacy notice](/privacy) for information about who handles your response, retention and your choices.',
  },
  {
    name: 'newsConsent',
    label: 'I would also like to receive wider Amagi and Caribbean Brain Health Summit news.',
    control: 'checkbox',
    wide: true,
  },
].map((field) => ({ ...field, section: 'ending', showWhen: answered }) as FieldDef)

const onRouteSection = (id: keyof typeof route, heading: string, notice?: string): FormSection => ({
  id,
  heading,
  notice,
  showWhen: { field: MAIN_REASON, choiceId: route[id] },
})

// The shared ending shows once a route is chosen.
const sections: FormSection[] = [
  { id: 'about', heading: 'About you' },
  onRouteSection('scientific', 'Scientific working meeting'),
  onRouteSection('stakeholder', 'Regional stakeholder dialogue'),
  onRouteSection(
    'expertise',
    'Expertise or collaboration',
    'Offering expertise does not create a partnership, speaking role, data-access agreement or continuing work commitment. Any role would be discussed and agreed separately.',
  ),
  onRouteSection(
    'publicInfo',
    'Public lecture and open-activity information',
    'You have asked to receive information about any public lecture or open activities associated with PLADRR Jamaica. These arrangements are being finalised. We will use your email address to provide the information you have requested; this is not registration for an event or for the scientific working meeting.',
  ),
  onRouteSection(
    'support',
    'Support enquiry',
    'Support arrangements require separate agreement. Support does not confer control over research findings, participant selection or access to participant information or research data.',
  ),
  { id: 'ending', heading: 'Final information and acknowledgements', showWhen: answered },
]

export const pladrrForm: FormDefinition = {
  submitLabel: 'Submit expression of interest',
  hidePrivacyLine: true,
  submitAfter: MAIN_REASON,
  sections,
  fields: [...aboutYou, ...scientific, ...stakeholder, ...expertise, ...support, ...ending],
}
