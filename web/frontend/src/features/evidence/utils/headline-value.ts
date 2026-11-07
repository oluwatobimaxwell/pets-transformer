import type { HeadlineTileOut } from '@/api/generated'

/** A headline number as its main figure and a quieter suffix, such as "254" and "of 254", or "ε" before a budget. */
export function headlineValue(tile: HeadlineTileOut): { prefix?: string; main: string; suffix?: string } {
  if (tile.format === 'percent') return { main: `${(tile.value * 100).toFixed(1)}%` }
  if (tile.format === 'count') return { main: tile.value.toLocaleString('en-US'), suffix: tile.total ? `of ${tile.total.toLocaleString('en-US')}` : undefined }
  if (tile.format === 'epsilon') return { prefix: 'ε', main: String(Number(tile.value.toFixed(3))) }
  return { main: tile.value.toFixed(2) }
}

/** How full the tile's meter is, 0–1, for the formats that have one. */
export function headlineMeter(tile: HeadlineTileOut): number | null {
  if (tile.format === 'score' || tile.format === 'percent') return tile.value
  if (tile.format === 'count' && tile.total) return tile.value / tile.total
  return null
}
