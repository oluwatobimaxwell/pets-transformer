import type { QuestionKind } from '../types'

interface QuestionShape {
  value: QuestionKind
  label: string
  columns: number
  grouped: boolean
}

const MEDIAN: QuestionShape = { value: 'median', label: 'Median of a number, by group', columns: 1, grouped: true }

/** What each kind of question asks, and how many value columns it takes. */
export const QUESTION_KINDS: QuestionShape[] = [
  MEDIAN,
  { value: 'mean', label: 'Average of a number, by group', columns: 1, grouped: true },
  { value: 'count', label: 'How rows spread across groups', columns: 0, grouped: true },
  { value: 'correlation', label: 'Do two numbers move together?', columns: 2, grouped: false },
  { value: 'distribution', label: 'Shape of one column', columns: 1, grouped: false },
]

export function questionKind(kind: QuestionKind): QuestionShape {
  return QUESTION_KINDS.find((item) => item.value === kind) ?? MEDIAN
}
