import type { PreviewOut, RunOut } from '@/api/generated'
import { isAnswerRun } from './gate-progress'
import { statusWord } from './status-words'

/** Where the live table stands: the gate's progress as the data shows it. */
export type TransformPhase = 'reading' | 'protecting' | 'checking' | 'decided' | 'answers'

export function transformPhase(run: RunOut, preview: PreviewOut | undefined): TransformPhase {
  if (isAnswerRun(run.events)) return 'answers'
  if (statusWord(run.status).finished) return 'decided'
  if (!preview?.columns.length) return 'reading'
  return preview.columns.some((column) => column.after) ? 'checking' : 'protecting'
}

const PHASE_WORDS: Record<Exclude<TransformPhase, 'decided'>, { title: string; says: string }> = {
  reading: { title: 'Reading the columns', says: 'Detect labels every column. Select then keeps only what the questions need.' },
  protecting: { title: 'Tuning the protection', says: 'Each column that leaves has its technique. The gate searches for the lightest settings that still answer the questions.' },
  checking: { title: 'Checking the protected rows', says: 'The rows are protected. The gate now attacks them the way an adversary would, and asks the questions of them.' },
  answers: { title: 'No rows leave', says: 'This recipient is the public, so the gate answers their questions with calibrated noise instead of releasing rows.' },
}

const DECIDED_SAYS: Record<string, string> = {
  release: 'These are the rows as the recipient receives them.',
  review: 'Protected, and waiting for a person to release them.',
  block: 'Some checks still failed, so none of these rows left.',
  error: 'The run failed, so nothing was released.',
}

/** The live table's heading and the sentence under it. */
export function phaseWords(phase: TransformPhase, status: string) {
  if (phase === 'decided') return { title: statusWord(status).label, says: DECIDED_SAYS[status] ?? '' }
  return PHASE_WORDS[phase]
}
