import { getPayload, Payload, type RequiredDataFromCollectionSlug } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { publishedOrAuthenticated } from '@/access/publishedOrAuthenticated'
import { isAdminFieldLevel } from '@/access/isAdminFieldLevel'
import type { User } from '@/payload-types'

let payload: Payload

function makeReq(user: Partial<User> | null) {
  return { user } as unknown as Parameters<typeof isAdmin>[0]['req']
}

describe('Access helpers', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  afterAll(async () => {
    await payload.delete({ collection: 'users', where: { email: { contains: 't004-' } } })
  })

  describe('isAdmin', () => {
    it('returns true for admin', () => {
      expect(isAdmin({ req: makeReq({ role: 'admin' }) } as never)).toBe(true)
    })

    it('returns false for editor', () => {
      expect(isAdmin({ req: makeReq({ role: 'editor' }) } as never)).toBe(false)
    })

    it('returns false for unauthenticated', () => {
      expect(isAdmin({ req: makeReq(null) } as never)).toBe(false)
    })
  })

  describe('isAdminOrEditor', () => {
    it('returns true for admin', () => {
      expect(isAdminOrEditor({ req: makeReq({ role: 'admin' }) } as never)).toBe(true)
    })

    it('returns true for editor', () => {
      expect(isAdminOrEditor({ req: makeReq({ role: 'editor' }) } as never)).toBe(true)
    })

    it('returns false for unauthenticated', () => {
      expect(isAdminOrEditor({ req: makeReq(null) } as never)).toBe(false)
    })
  })

  describe('publishedOrAuthenticated', () => {
    it('returns true for admin', () => {
      expect(publishedOrAuthenticated({ req: makeReq({ role: 'admin' }) } as never)).toBe(true)
    })

    it('returns true for editor', () => {
      expect(publishedOrAuthenticated({ req: makeReq({ role: 'editor' }) } as never)).toBe(true)
    })

    it('returns published query constraint for unauthenticated', () => {
      const result = publishedOrAuthenticated({ req: makeReq(null) } as never)
      expect(result).toEqual({ _status: { equals: 'published' } })
    })
  })

  describe('isAdminFieldLevel', () => {
    it('returns true for admin', () => {
      expect(isAdminFieldLevel({ req: makeReq({ role: 'admin' }) } as never)).toBe(true)
    })

    it('returns false for editor', () => {
      expect(isAdminFieldLevel({ req: makeReq({ role: 'editor' }) } as never)).toBe(false)
    })

    it('returns false for unauthenticated', () => {
      expect(isAdminFieldLevel({ req: makeReq(null) } as never)).toBe(false)
    })
  })

  describe('users collection access', () => {
    let adminUser: User
    let editorUser: User

    beforeAll(async () => {
      adminUser = await payload.create({
        collection: 'users',
        data: {
          email: 't004-admin@test.local',
          password: 'Test1234!',
          role: 'admin',
        },
      })

      editorUser = await payload.create({
        collection: 'users',
        data: {
          email: 't004-editor@test.local',
          password: 'Test1234!',
          role: 'editor',
        },
      })
    })

    it('admin can read all users', async () => {
      const result = await payload.find({
        collection: 'users',
        user: adminUser,
        overrideAccess: false,
      })
      expect(result.totalDocs).toBeGreaterThanOrEqual(2)
    })

    it('editor can only read themselves', async () => {
      const result = await payload.find({
        collection: 'users',
        user: editorUser,
        overrideAccess: false,
      })
      expect(result.totalDocs).toBe(1)
      expect(result.docs[0].id).toBe(editorUser.id)
    })

    it('new users default to editor role', async () => {
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: 't004-default@test.local',
          password: 'Test1234!',
        } as RequiredDataFromCollectionSlug<'users'>,
      })
      expect(newUser.role).toBe('editor')
    })

    it('editor cannot escalate own role', async () => {
      const updated = await payload.update({
        collection: 'users',
        id: editorUser.id,
        user: editorUser,
        overrideAccess: false,
        data: { role: 'admin' },
      })
      expect(updated.role).toBe('editor')
    })
  })
})
