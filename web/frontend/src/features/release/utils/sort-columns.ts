import type { ColumnOut } from '@/api/generated'

/** Unsure columns first, so a person sees what needs them. */
export function unsureFirst(a: ColumnOut, b: ColumnOut) {
  return Number(b.needs_review) - Number(a.needs_review)
}
