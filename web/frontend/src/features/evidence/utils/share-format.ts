/** A share of people or records, 0–1, as a percentage with one decimal where it matters. */
export function formatShare(value: number | null | undefined) {
  if (value === null || value === undefined) return '–'
  if (value === 0) return '0%'
  if (value < 0.001) return '<0.1%'
  return `${Number((value * 100).toFixed(1))}%`
}

/** A risk from 0 to 1, precise enough that a small risk never reads as none. */
export function formatRisk(value: number) {
  if (value === 0) return '0'
  if (value < 0.001) return '<0.001'
  return value.toFixed(3)
}

/** A measured value, with no more than four decimals. */
export function formatMeasure(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return '–'
  if (typeof value === 'string') return value
  return Number.isInteger(value) ? value.toLocaleString('en-US') : String(Math.round(value * 10000) / 10000)
}
