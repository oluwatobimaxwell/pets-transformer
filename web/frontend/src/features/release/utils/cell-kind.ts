/** How one value in the live table reads: a value, an empty cell, or a row the gate withheld from the release. */
export type CellKind = 'value' | 'blank' | 'withheld'

export function cellKind(value: string | null): CellKind {
  if (value === null) return 'withheld'
  return value.trim() === '' ? 'blank' : 'value'
}
