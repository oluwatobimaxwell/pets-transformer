/** Codes that start with pt are keyed pseudonyms; bracketed labels such as [NAME_1] mark redacted text. */
const TOKEN = /^pt[0-9a-f]{16}$/
const PLACEHOLDER = /(\[[A-Z_]+_\d+\])/

export function isToken(value: unknown): value is string {
  return typeof value === 'string' && TOKEN.test(value)
}

/** Text split around its redaction placeholders, each part marked. */
export function textParts(text: string) {
  return text.split(PLACEHOLDER).filter(Boolean).map((part) => ({ text: part, placeholder: PLACEHOLDER.test(part) }))
}

export interface RowQuery {
  query: string
  token: string
  /** The column to sort by, or -1 for the sample's own order. */
  sort: number
  direction: 1 | -1
}

function compare(a: unknown, b: unknown) {
  const x = Number(a)
  const y = Number(b)
  if (a !== '' && b !== '' && a !== null && b !== null && !Number.isNaN(x) && !Number.isNaN(y)) return x - y
  return String(a ?? '').localeCompare(String(b ?? ''))
}

/** The rows that contain the code and the search text, sorted as asked. */
export function queryRows(rows: unknown[][], { query, token, sort, direction }: RowQuery) {
  const needle = query.trim().toLowerCase()
  const found = rows.filter((row) => (!token || row.includes(token)) && (!needle || row.join(' ').toLowerCase().includes(needle)))
  return sort < 0 ? found : [...found].sort((a, b) => compare(a[sort], b[sort]) * direction)
}
