import type { ColumnOut } from '@/api/generated'
import type { Decisions } from '../types'
import { ROLE_ORDER } from './role-words'

/** How many columns hold each kind of data, counting a person's decision over Detect's, in the order roles are explained. */
export function roleCounts(columns: Pick<ColumnOut, 'key' | 'role'>[], decisions: Decisions = {}) {
  const counts = new Map<string, number>()
  for (const column of columns) {
    const role = decisions[column.key]?.role ?? column.role
    counts.set(role, (counts.get(role) ?? 0) + 1)
  }
  return ROLE_ORDER.filter((role) => counts.has(role)).map((role) => ({ role, count: counts.get(role)! }))
}
