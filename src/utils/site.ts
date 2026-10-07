import { env } from '@/env'

// Test mode (SPEC §11.1) unless SITE_LIVE is exactly "true".
export const isLive = (): boolean => env.SITE_LIVE === 'true'
