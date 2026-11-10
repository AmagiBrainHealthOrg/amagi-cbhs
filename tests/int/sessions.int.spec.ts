import { describe, expect, it } from 'vitest'

import { inZone } from '@/utils/sessions'

describe('inZone', () => {
  it('moves a session entered in Jamaica time to Barbados time', () => {
    expect(
      inZone(
        { day: '2026-11-17', startTime: '18:00', endTime: '20:30' },
        'America/Jamaica',
        'America/Barbados',
      ),
    ).toEqual({ day: '2026-11-17', startTime: '19:00', endTime: '21:30' })
  })

  it('moves the day when the time crosses midnight', () => {
    expect(
      inZone({ day: '2026-11-21', startTime: '23:30' }, 'America/Jamaica', 'America/Barbados'),
    ).toEqual({ day: '2026-11-22', startTime: '00:30' })
  })

  it('leaves the same zone, or a session without a day or time, as it is', () => {
    const session = { day: '2026-11-17', startTime: '18:00', endTime: null }
    expect(inZone(session, 'America/Jamaica', 'America/Jamaica')).toBe(session)
    expect(
      inZone({ day: null, startTime: '18:00' }, 'America/Jamaica', 'America/Barbados'),
    ).toEqual({ day: null, startTime: '18:00' })
  })

  it('keeps Cayman and Jamaica the same during Summit week', () => {
    expect(
      inZone({ day: '2026-11-19', startTime: '09:00' }, 'America/Jamaica', 'America/Cayman'),
    ).toEqual({ day: '2026-11-19', startTime: '09:00' })
  })
})
