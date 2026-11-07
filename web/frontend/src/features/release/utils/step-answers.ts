import type { ReleaseDraft } from '../types'
import { recipientName } from './recipient-name'

/** What the person answered at a step, shown under the step's name once it's done. Mono marks an id or a file name. */
export interface StepAnswer {
  text: string
  mono: boolean
}

/** Each step's answer so far, in step order, or null where the step has nothing to show yet. */
export function stepAnswers(draft: ReleaseDraft): (StepAnswer | null)[] {
  const tables = draft.dataset?.tables.length ?? 0
  const recipient = recipientName(draft)
  const decided = Object.keys(draft.decisions).length
  return [
    draft.dataset ? { text: `${draft.dataset.name} · ${tables} ${tables === 1 ? 'table' : 'tables'}`, mono: true } : null,
    recipient ? { text: recipient, mono: Boolean(draft.scenarioId) } : null,
    draft.dataset
      ? { text: decided ? `${decided} ${decided === 1 ? 'decision' : 'decisions'} of your own` : "Detect's labels as they are", mono: false }
      : null,
    null,
  ]
}
