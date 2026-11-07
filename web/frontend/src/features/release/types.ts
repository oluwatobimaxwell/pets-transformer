import type { CustomScenarioIn, DatasetOut, QuestionIn, ReviewDecisionIn } from '@/api/generated'

/** A person's decisions about columns, keyed by `table.column`. */
export type Decisions = Record<string, ReviewDecisionIn>

export type QuestionKind = QuestionIn['kind']

export interface ReleaseDraft {
  dataset: DatasetOut | null
  /** A challenge scenario id, or null when the person describes their own recipient. */
  scenarioId: string | null
  custom: CustomScenarioIn
  decisions: Decisions
}

export const STEP_TITLES = ['Data', 'Recipient', 'Columns', 'Run'] as const
