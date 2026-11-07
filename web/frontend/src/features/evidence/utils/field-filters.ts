import type { FieldEvidenceOut } from '@/api/generated'

export type FieldFilter = 'kept' | 'removed' | 'review' | 'all'

const MATCHES: Record<FieldFilter, (field: FieldEvidenceOut) => boolean> = {
  kept: (field) => field.pet !== 'remove',
  removed: (field) => field.pet === 'remove',
  review: (field) => Boolean(field.needs_review),
  all: () => true,
}

export const FIELD_FILTERS: { value: FieldFilter; label: string }[] = [
  { value: 'kept', label: 'Leaves' },
  { value: 'removed', label: 'Removed' },
  { value: 'review', label: 'Needs review' },
  { value: 'all', label: 'All' },
]

export function fieldCounts(fields: FieldEvidenceOut[]): Record<FieldFilter, number> {
  return { kept: fields.filter(MATCHES.kept).length, removed: fields.filter(MATCHES.removed).length, review: fields.filter(MATCHES.review).length, all: fields.length }
}

/** The columns under a filter whose name, role, technique or reason contains the query. */
export function filterFields(fields: FieldEvidenceOut[], filter: FieldFilter, query: string) {
  const needle = query.trim().toLowerCase()
  return fields.filter((field) => MATCHES[filter](field) && (!needle || `${field.field} ${field.role} ${field.pet} ${field.why}`.toLowerCase().includes(needle)))
}
