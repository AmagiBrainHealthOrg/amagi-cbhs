import type { FormKey } from './forms'

// The Airtable base is the source of truth (docs/AIRTABLE.md). Tables, fields and choices are
// referenced by ID, so renaming them in Airtable never breaks the site. `pnpm airtable:check`
// confirms every ID below still exists with a compatible type. Forms ask Follow-up preferences,
// not the base's Permissions field (decided 9 October 2026).

export type FieldKind =
  | 'text'
  | 'longText'
  | 'email'
  | 'phone'
  | 'url'
  | 'date'
  | 'dateTime'
  | 'currency'
  | 'link'
  | 'select'
  | 'checkbox'

export type FieldName =
  | 'name'
  | 'email'
  | 'phone'
  | 'organisation'
  | 'role'
  | 'location'
  | 'describesYou'
  | 'engagement'
  | 'areaOfWork'
  | 'areaOfWorkOther'
  | 'interest'
  | 'support'
  | 'actionArea'
  | 'website'
  | 'industry'
  | 'industryOther'
  | 'involvement'
  | 'activityDate'
  | 'activity'
  | 'enquiryType'
  | 'outlet'
  | 'message'
  | 'followUp'
  | 'session'
  | 'acknowledgement'
  | 'city'
  | 'activityTitle'
  | 'activityTypes'
  | 'activityTypeOther'
  | 'deliveryFormat'
  | 'activityTime'
  | 'timeZone'
  | 'venueStatus'
  | 'venue'
  | 'estimatedAttendance'
  | 'attendanceAccess'
  | 'attendanceGroup'
  | 'registrationNeeded'
  | 'publicListing'
  | 'postActivity'
  | 'country'
  | 'mainReason'
  | 'perspectives'
  | 'perspectiveOther'
  | 'careerStage'
  | 'caribbeanConnection'
  | 'relevantWork'
  | 'profile'
  | 'workingThemes'
  | 'clarifyQuestion'
  | 'contribution'
  | 'resources'
  | 'canAttend'
  | 'availability'
  | 'supportNeeded'
  | 'privateContact'
  | 'alreadyInvited'
  | 'organiserReview'
  | 'stakeholderPerspective'
  | 'stakeholderQuestion'
  | 'stakeholderAttend'
  | 'stakeholderCapacity'
  | 'approvalNotes'
  | 'expertise'
  | 'expertiseTheme'
  | 'expertiseCapacity'
  | 'supportType'
  | 'supportDescription'
  | 'supportCapacity'
  | 'anythingElse'
  | 'eoiAcknowledged'
  | 'privacyAcknowledged'
  | 'newsConsent'

export type AirtableField = { id: string; kind: FieldKind }

export type AirtableTable<Name extends string = string> = {
  table: string
  fields: Partial<Record<Name, AirtableField>>
}

export type AirtableForm = AirtableTable<FieldName>

const text = (id: string): AirtableField => ({ id, kind: 'text' })
const longText = (id: string): AirtableField => ({ id, kind: 'longText' })
const email = (id: string): AirtableField => ({ id, kind: 'email' })
const phone = (id: string): AirtableField => ({ id, kind: 'phone' })
const link = (id: string): AirtableField => ({ id, kind: 'link' })
const select = (id: string): AirtableField => ({ id, kind: 'select' })

export const airtableForms: Record<FormKey, AirtableForm> = {
  'register-interest': {
    table: 'tblXL6IU0xgqFPIwS', // Registered Interest
    fields: {
      name: text('fldOsWciSV2ngV018'),
      email: email('fld0NJqFbzIMkMSQT'),
      phone: phone('fldbQ1CZ0JDdWAqHk'),
      organisation: text('fld25mUdKYN533y6E'),
      role: text('fldhP7MW5RGGYx0ve'),
      location: link('fld0SqA6IChaZ9ud9'),
      describesYou: link('fldSWsdi8Upo9tjtj'),
      engagement: link('fldzoB7k7PPEtCnoo'),
      areaOfWork: link('fldJks8a4rB2KHU60'),
      areaOfWorkOther: text('fldkzvynrrEy4Dcnw'),
      interest: longText('fld2ELUV14ptAMA1M'),
      support: longText('fldTHdC2t3VjwTHaM'),
      followUp: select('fldl68DnhNOsCweUC'),
    },
  },
  'cta-consultation': {
    table: 'tblIicP62Ypszguft', // Join the consultation
    fields: {
      name: text('fldhjrk40HpiIBZO2'),
      email: email('fldwVhXiR9aoAgqhM'),
      phone: phone('fldvuuEEb6tdRmMNJ'),
      organisation: text('fldKsaih9KKSP3wW3'),
      role: text('fldzNmpVi2X05j2mG'),
      location: link('fldVWf0jzCWKfxz1s'),
      describesYou: link('fldv5pbQjIOJ9x1TC'),
      actionArea: link('fldIIvbYMAoxl7pK9'),
      followUp: select('fldWOj0Rb2ZtsXBfo'),
    },
  },
  partner: {
    table: 'tbl4KaPiTjpUWosJC', // Partner with the Summit
    fields: {
      name: text('fldDLpkgR2pK5JXib'),
      email: email('fldSnfXuIuaQXooLV'),
      phone: phone('fldRWsEQ2rtFeuKhS'),
      organisation: text('fld6U8it05Kkcbuqc'),
      role: text('fldVfkp79nXssr0QP'),
      website: { id: 'fldcVKIgO8giysPtr', kind: 'url' },
      location: link('fldhod0vqXWcCFxvB'),
      describesYou: link('fldS2Epu2P0UrDbPd'),
      industry: link('fldiYInN0DQBDNrCQ'),
      industryOther: text('fldEPc59OSvnI1Ive'),
      involvement: longText('fldoyPZcrL90M9bXk'),
      followUp: select('fldigh032nZVP5zJx'),
    },
  },
  relay: {
    table: 'tblvrU5yiaVp4o899', // Propose a Brain Health Relay activity
    fields: {
      name: text('fld4s9AwgTVfdJDII'),
      email: email('fldj4ZdK7lGl5o4bs'),
      phone: phone('fldiDcU6riZamuqHp'),
      organisation: text('fldxBSyJpWgPkbaQJ'),
      role: text('fldmW4FnyetXArGgm'),
      location: link('fldI5XgLPOsHKFdV8'),
      describesYou: link('fld184m3k3KBQMnQs'),
      activityDate: { id: 'fldPB1I9UU5reAHGo', kind: 'date' },
      activity: longText('fldPfzfsQCFvU9RnR'), // "About" in the base
      followUp: select('fldJX1gjrevqX5f94'),
      acknowledgement: { id: 'fldvlFXSFwQ5nuQ7H', kind: 'checkbox' },
      city: text('fldwlkax6VZ2rTZ9d'),
      activityTitle: text('fldJ3DE7FhMHlpB7P'),
      activityTypes: select('fld1nIFzwcYT4hpvq'),
      activityTypeOther: text('fldFI0Dy4SyZLMA2F'),
      deliveryFormat: select('fld4fH9E12sIFogR0'),
      activityTime: text('fldWQSlveLtSy8Ftv'),
      timeZone: text('fldElPTK9SGNFFrJV'),
      venueStatus: select('fld9kauhZtM0UNPvZ'),
      venue: text('fld0lGVmnVBmqHC2R'),
      estimatedAttendance: text('fldkivxtOUoQ6rb0D'),
      attendanceAccess: select('fldcUdbECyWaxN4uv'),
      attendanceGroup: longText('fldv0pTS7edvBTN6b'),
      registrationNeeded: select('fldm0Q8pk227RLcJq'),
      support: longText('fldQG9VMieRSAA3Y5'),
      publicListing: select('fldZPWj9rOMocjZLX'),
      postActivity: select('fldoMFbiO2VunHCR4'),
    },
  },
  contact: {
    table: 'tblwLAR0G0y8lTVd4', // Enquiries
    fields: {
      name: text('fldnsqloyok5WZdIk'),
      email: email('fldzNdzLR20u0Q5x5'),
      phone: phone('fldKQvL5GcVVCEDow'),
      organisation: text('fldB5Q3jqr5NJ7LNQ'),
      role: text('fldQPBV2LkYoEBdcq'),
      location: link('fldzSUJco5zSFdHUl'),
      enquiryType: select('fldrD61vghvJjg1Wt'),
      outlet: text('fld5VA36NVFxm7LOp'),
      message: longText('fldK626l63vHmFGeO'), // "Enquiry" in the base
      followUp: select('fldU6CMtXg6aiArBO'),
    },
  },
  // Field descriptions in the base give each question's ID (B1…H4).
  'pladrr-eoi': {
    table: 'tbllZwqx8hnRzFHto', // PLADRR expressions of interest
    fields: {
      name: text('fldOPrHn4PK6EqQcg'),
      email: email('fldmw1sdmPkqWz2hk'),
      country: text('fldILxjePdryVGzB7'),
      organisation: text('fldQkM8azAOLAOvYg'),
      role: text('fldMeFPsuu6FDfn1S'),
      mainReason: select('fldfrBYuQMrmpxkno'),
      perspectives: select('fldAj146YPYXhw079'),
      perspectiveOther: text('fld9TkkZUc1frA3Ss'),
      careerStage: select('fldCAFjUohK2hjwdX'),
      caribbeanConnection: longText('fldCay5IHusIFqKMG'),
      relevantWork: longText('fld7eYqoRi8p3ZmLz'),
      profile: { id: 'fldHfKL2ZAvAo34T9', kind: 'url' },
      workingThemes: select('flduY6yPrCN939lpv'),
      clarifyQuestion: longText('fldN98BFefJ4IMI0v'),
      contribution: longText('fldfaPrysvN1pbfsj'),
      resources: longText('fldCbN5b9DL9Ns3DV'),
      canAttend: select('fldvrkhlkWD7iyS96'),
      availability: longText('fldYE5mjPowuMOpeU'),
      supportNeeded: select('fldSppY62jkw8fvNl'),
      privateContact: select('fldIdTacD5RrgRoV8'),
      alreadyInvited: select('fldbFPgechLxhAt0P'),
      organiserReview: { id: 'fldGWvkfk2S3F9Ldv', kind: 'checkbox' }, // set by the server
      stakeholderPerspective: longText('fld8OFfK8eWHK2mwc'),
      stakeholderQuestion: longText('fldjJiv5ImwmdwKbo'),
      stakeholderAttend: select('fldd9ua4ZBYkGccRX'),
      stakeholderCapacity: select('fldBtCOf7slmPRpWH'),
      approvalNotes: longText('fld9d894x4wnJ2uwV'),
      expertise: longText('fldRlktaIyaBMhrtf'),
      expertiseTheme: longText('fldSIAjAmx9yJykAm'),
      expertiseCapacity: select('fldVm62cabVKsNwK8'),
      supportType: select('fld8I4pnHCzsXC5Wi'),
      supportDescription: longText('fldLkwc0Z8IJD7GQE'),
      supportCapacity: select('fldbZLnZelVQhaI3A'),
      anythingElse: longText('fld48F9888adWrLO6'),
      eoiAcknowledged: { id: 'fldiZSy981dNRxtvW', kind: 'checkbox' },
      privacyAcknowledged: { id: 'fld9fd7vNDNHa8wyX', kind: 'checkbox' },
      newsConsent: { id: 'fldqde4WafpFnkeVD', kind: 'checkbox' },
    },
  },
  // Email is the primary field, a single line text.
  'session-registration': {
    table: 'tblmdrD7SJ18AXXvx',
    fields: {
      name: text('fld0xct9dSmjAiATW'),
      email: text('fldVy2PoYtWjQQBoM'),
      phone: phone('fldulYZRtN24xN7Oh'),
      organisation: text('fldbKpxNjKISSAUGp'),
      location: link('fldMSKCQgRetcezgq'),
      session: text('fldyq26tWQ3ERvYZX'), // "Title · day, time · location", set by the server
    },
  },
}

// SPEC §7.5. UTM and Source page are attribution columns, matched by name (docs/AIRTABLE.md).
// `session` is the upsert key, so a resent Stripe event updates its row instead of adding one.
export const airtableDonations = {
  table: 'tblw6QuZgBkgrHCA7', // Donation
  fields: {
    amount: { id: 'fldvVOPq2FGcxaalq', kind: 'currency' },
    currency: text('fldIq2g1Oe1wQyvle'),
    date: { id: 'fldmjgLgqpYeP2I5W', kind: 'dateTime' },
    session: text('fldiuo5lRe9SodMKh'), // "Stripe Session"
  },
} as const satisfies { table: string; fields: Record<string, AirtableField> }

// Airtable field types each kind accepts. Selects may be single or multiple: the base decides.
export const compatibleTypes: Record<FieldKind, readonly string[]> = {
  text: ['singleLineText'],
  longText: ['multilineText', 'richText'],
  email: ['email'],
  phone: ['phoneNumber', 'singleLineText'],
  url: ['url'],
  date: ['date'],
  dateTime: ['dateTime'],
  currency: ['currency', 'number'],
  link: ['multipleRecordLinks'],
  select: ['singleSelect', 'multipleSelects'],
  checkbox: ['checkbox'],
}
