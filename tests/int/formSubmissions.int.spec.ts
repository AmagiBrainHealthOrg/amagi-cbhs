import { getPayload, Payload, type RequiredDataFromCollectionSlug } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { formOptions } from '@/config/forms'
import type { User } from '@/payload-types'

let payload: Payload
let admin: User
let editor: User

const prefix = 't008-int'

describe('Form submissions', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    admin = await payload.create({
      collection: 'users',
      data: { email: `${prefix}-admin@test.local`, password: 'test-password-1', role: 'admin' },
    })
    editor = await payload.create({
      collection: 'users',
      data: { email: `${prefix}-editor@test.local`, password: 'test-password-1', role: 'editor' },
    })
  })

  afterAll(async () => {
    await payload.delete({
      collection: 'form-submissions',
      where: { territory: { equals: prefix } },
    })
    await payload.delete({ collection: 'users', where: { email: { like: prefix } } })
  })

  it('stores every form key, with phone in data and defaults for consents and isTest', async () => {
    for (const { value } of formOptions) {
      const doc = await payload.create({
        collection: 'form-submissions',
        data: {
          form: value,
          data: { name: 'Test', email: `${prefix}@test.local`, phone: '+1 246 555 0100' },
          territory: prefix,
          audienceType: 'general_public',
          airtableSyncStatus: 'pending',
          utm: { source: 'newsletter' },
        },
      })
      expect(doc).toMatchObject({
        form: value,
        airtableSyncStatus: 'pending',
        isTest: false,
        consents: { contact: false, publicName: false, shareStory: false },
        utm: { source: 'newsletter' },
        data: { phone: '+1 246 555 0100' },
      })
    }
  })

  it('is admin-only for every operation', async () => {
    const data: RequiredDataFromCollectionSlug<'form-submissions'> = {
      form: 'register-interest',
      data: {},
      territory: prefix,
      airtableSyncStatus: 'pending',
    }
    const doc = await payload.create({ collection: 'form-submissions', data })

    for (const user of [editor, undefined]) {
      await expect(
        payload.find({ collection: 'form-submissions', overrideAccess: false, user }),
      ).rejects.toThrow()
      await expect(
        payload.create({
          collection: 'form-submissions',
          data,
          overrideAccess: false,
          user,
        }),
      ).rejects.toThrow()
      await expect(
        payload.update({
          collection: 'form-submissions',
          id: doc.id,
          data: { isTest: true },
          overrideAccess: false,
          user,
        }),
      ).rejects.toThrow()
      await expect(
        payload.delete({
          collection: 'form-submissions',
          id: doc.id,
          overrideAccess: false,
          user,
        }),
      ).rejects.toThrow()
    }

    const { totalDocs } = await payload.find({
      collection: 'form-submissions',
      where: { id: { equals: doc.id } },
      overrideAccess: false,
      user: admin,
    })
    expect(totalDocs).toBe(1)
  })
})
