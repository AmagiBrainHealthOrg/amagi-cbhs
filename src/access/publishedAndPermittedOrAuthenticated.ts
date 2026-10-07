import type { Access, Where } from 'payload'

// Names and logos are public only with the organisation's permission (CLAUDE.md hard rules).
export const publishedAndPermittedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  const published: Where = { _status: { equals: 'published' } }
  const permitted: Where = { permissionConfirmed: { equals: true } }
  return { and: [published, permitted] }
}
