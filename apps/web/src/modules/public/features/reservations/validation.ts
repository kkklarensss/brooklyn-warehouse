import { manilaDate } from '../../../../shared/lib/format'

export function validateSchedule(date: string, time: string, now = new Date()): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time))
    return 'Choose a date and time.'
  const start = new Date(`${date}T${time}:00+08:00`)
  if (!Number.isFinite(start.getTime()) || manilaDate(start) !== date)
    return 'Choose a valid calendar date and time.'
  if (start.getTime() <= now.getTime()) return 'Choose a future date and time in Manila.'
  return null
}
