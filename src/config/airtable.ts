import type { FormKey } from './forms'

// The Airtable base is the source of truth (docs/AIRTABLE.md). Tables, fields and choices are
// referenced by ID, so renaming them in Airtable never breaks the site. `pnpm airtable:check`
// confirms every ID below still exists with a compatible type.

export type FieldKind = 'text' | 'longText' | 'email' | 'phone' | 'url' | 'date' | 'link' | 'select'

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
  | 'permissions'

export type Consent = 'contact' | 'publicName' | 'shareStory'

export type AirtableField = { id: string; kind: FieldKind }

export type AirtableForm = {
  table: string
  fields: Partial<Record<FieldName, AirtableField>>
  // Choice IDs on the form's `Permissions` field, one per consent (SPEC §8.1).
  consentChoices: Record<Consent, string>
}

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
      permissions: select('fldqrRftfGaQhJrpl'),
    },
    consentChoices: {
      contact: 'selu13INia3RznwTw',
      publicName: 'selhn3bz3k95e5dBp',
      shareStory: 'selafm6smQEcFjhq1',
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
      permissions: select('fldoxq03YOta8yikJ'),
    },
    consentChoices: {
      contact: 'selhHkFKWmkaWFnoD',
      publicName: 'selwQth7IYkchp8BQ',
      shareStory: 'selyH3aw7KvGLDUnI',
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
      permissions: select('fldN8k4Z00DsqUjVs'),
    },
    consentChoices: {
      contact: 'selnA1swl9scJVn67',
      publicName: 'selLzchDEkgnZjO13',
      shareStory: 'selabiBUPOaA6kC5y',
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
      permissions: select('fldM4YzM8OtFqzyxT'),
    },
    consentChoices: {
      contact: 'selXDBCWoM9U0h8yj',
      publicName: 'sel9SpxXrgCAJHEEJ',
      shareStory: 'selSU8Q0DHKMLbA3R',
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
      permissions: select('fld9bw4Z2rdYrVPdO'),
    },
    consentChoices: {
      contact: 'selDMLay48yFGvWXA',
      publicName: 'selN4STw09m54VSEf',
      shareStory: 'selvatJyNRyP9gwGe',
    },
  },
}

// Airtable field types each kind accepts. Selects may be single or multiple: the base decides.
export const compatibleTypes: Record<FieldKind, readonly string[]> = {
  text: ['singleLineText'],
  longText: ['multilineText', 'richText'],
  email: ['email'],
  phone: ['phoneNumber', 'singleLineText'],
  url: ['url'],
  date: ['date'],
  link: ['multipleRecordLinks'],
  select: ['singleSelect', 'multipleSelects'],
}
