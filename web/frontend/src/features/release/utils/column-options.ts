import type { DatasetOut } from '@/api/generated'

/** Every column of a dataset as `table.column`, the form the engine expects. */
export function columnOptions(dataset: DatasetOut | null) {
  if (!dataset) return []
  return dataset.tables.flatMap((table) => table.columns.map((column) => ({ value: `${table.name}.${column}`, label: `${table.name} · ${column}` })))
}
