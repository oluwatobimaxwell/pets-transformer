import { Path } from '@/router/paths'
import { stepOfPath } from '@/features/release'

/** Where a page sits in the studio, so the next one swings in from the direction of travel. */
export function pageOrder(pathname: string) {
  const step = stepOfPath(pathname)
  if (step >= 0) return step
  return pathname.replace(/\/+$/, '') === Path.Runs ? 4 : 5
}
