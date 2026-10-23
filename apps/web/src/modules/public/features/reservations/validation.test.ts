import { describe, expect, it } from 'vitest'
import { manilaDate } from '../../../../shared/lib/format'
import { validateSchedule } from './validation'

describe('Manila booking schedule', () => {
  const now = new Date('2026-10-23T08:00:00Z') // 16:00 in Manila.
  it('accepts a future time in Manila', () => {
    expect(validateSchedule('2026-10-23', '16:01', now)).toBeNull()
  })
  it('rejects past times and exact current time', () => {
    expect(validateSchedule('2026-10-23', '15:59', now)).toBeTruthy()
    expect(validateSchedule('2026-10-23', '16:00', now)).toBeTruthy()
  })
  it('rejects invalid dates and times instead of accepting normalized dates', () => {
    expect(validateSchedule('2027-02-30', '12:00', now)).toBeTruthy()
    expect(validateSchedule('2026-10-24', '99:99', now)).toBeTruthy()
    expect(validateSchedule('', '', now)).toBeTruthy()
  })
  it('uses the Manila date across the UTC midnight boundary', () => {
    expect(manilaDate(new Date('2026-10-23T17:00:00Z'))).toBe('2026-10-24')
    expect(validateSchedule('2026-10-24', '01:01', new Date('2026-10-23T17:00:00Z'))).toBeNull()
  })
})
