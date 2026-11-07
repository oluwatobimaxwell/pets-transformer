import { ListChecks, PenLine } from 'lucide-react'
import type { ChoiceOption } from '../components/choice-cards'
import type { ReleaseDraft } from '../types'

export type RecipientMode = 'challenge' | 'custom'

/** The two ways to say who receives the data, as the second step offers them for a challenge dataset. */
export const RECIPIENT_MODES: ChoiceOption<RecipientMode>[] = [
  { value: 'challenge', label: 'Challenge scenario', icon: ListChecks, badge: 'Recommended',
    text: "A recipient from the challenge brief, with its questions and limits already set, so results compare with the challenge's baselines." },
  { value: 'custom', label: 'Describe your own recipient', icon: PenLine,
    text: 'Say who gets the data, how far they are trusted and which questions they must still be able to answer.' },
]

/** Which way the second step opens: a challenge dataset starts on its scenarios unless the person already described a recipient. */
export function initialRecipientMode(draft: ReleaseDraft): RecipientMode {
  if (draft.dataset?.source !== 'sample') return 'custom'
  return draft.scenarioId || !draft.custom.recipient.trim() ? 'challenge' : 'custom'
}
