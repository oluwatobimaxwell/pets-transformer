import type { RunEventOut } from '@/api/generated'
import { ANSWER_STAGES, GATE_STAGES } from './stage-words'

export type StageState = 'done' | 'current' | 'waiting'

/** A public recipient's run, which answers questions with noise instead of releasing rows. */
export function isAnswerRun(events: RunEventOut[]) {
  return events.some((event) => event.stage === 'answers')
}

/** The stages a run goes through: rows for most recipients, answers for a public one. */
export function trackerStages(events: RunEventOut[]) {
  return isAnswerRun(events) ? ANSWER_STAGES : GATE_STAGES
}

/**
 * Where each stage stands. The engine reports a stage when it starts it, so every stage before the latest one is done,
 * and a finished run has done them all. Transform has no event of its own: it is done once Verify starts.
 */
export function stageStates(events: RunEventOut[], finished: boolean): Record<string, StageState> {
  const stages = trackerStages(events)
  const reached = stages.reduce((last, stage, index) => (events.some((event) => event.stage === stage.key) ? index : last), -1)
  return Object.fromEntries(stages.map((stage, index) => [stage.key, finished || index < reached ? 'done' : index === reached ? 'current' : 'waiting']))
}

/** The latest thing the engine said about a stage, to show under it. */
export function stageMessage(events: RunEventOut[], stage: string) {
  return [...events].reverse().find((event) => event.stage === stage)?.message ?? ''
}
