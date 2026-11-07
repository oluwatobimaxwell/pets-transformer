import type { RunEventOut } from '@/api/generated'

/** A moment as a reader would say it, such as "7 Nov 2026, 18:19", in the reader's own time zone. */
export function formatMoment(at: string) {
  const date = new Date(at)
  if (Number.isNaN(date.getTime())) return at
  return date.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/** How long the run took, from its first event to its last, such as "6 s" or "2 min 4 s". */
export function runDuration(events: RunEventOut[]) {
  if (events.length < 2) return null
  const seconds = Math.max(0, Math.round((Date.parse(events.at(-1)!.at) - Date.parse(events[0]!.at)) / 1000))
  if (Number.isNaN(seconds)) return null
  return seconds < 60 ? `${seconds} s` : `${Math.floor(seconds / 60)} min ${seconds % 60} s`
}
