import type { Readout } from './studio-view'

/** How each kind of rail figure is written while it counts. */
export const READOUT_FORMATS: Record<Readout['format'], (value: number) => string> = {
  int: (value) => Math.round(value).toLocaleString('en-US'),
  score: (value) => value.toFixed(2),
  percent: (value) => `${Math.round(value * 100)}%`,
}
