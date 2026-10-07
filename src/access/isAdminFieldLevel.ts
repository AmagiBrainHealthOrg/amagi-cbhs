import type { FieldAccess } from 'payload'
import type { User } from '@/payload-types'

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return (user as User | null)?.role === 'admin'
}
