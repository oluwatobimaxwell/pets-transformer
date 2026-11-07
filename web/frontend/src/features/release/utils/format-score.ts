/** Scores run from 0 to 1. */
export function formatScore(value: number | null | undefined) {
  return value === null || value === undefined ? '–' : value.toFixed(2)
}

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}
