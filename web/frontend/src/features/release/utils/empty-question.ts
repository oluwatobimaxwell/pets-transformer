import type { QuestionIn } from '@/api/generated'
import type { QuestionKind } from '../types'
import { questionKind } from './question-kinds'

/** A blank question of a kind, with one empty slot per column it needs. */
export function emptyQuestion(kind: QuestionKind = 'median'): QuestionIn {
  const shape = questionKind(kind)
  return { kind, ask: '', columns: Array(shape.columns).fill(''), by: shape.grouped ? [''] : [] }
}

/** Drops empty slots before sending, so half-filled rows don't confuse the engine. */
export function filledQuestion(question: QuestionIn): QuestionIn {
  return { ...question, columns: (question.columns ?? []).filter(Boolean), by: (question.by ?? []).filter(Boolean) }
}
