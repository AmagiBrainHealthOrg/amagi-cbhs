import type { Access } from 'payload'
import type { User } from '@/payload-types'

export const isAdmin: Access = ({ req: { user } }) => {
  return (user as User | null)?.role === 'admin'
}
