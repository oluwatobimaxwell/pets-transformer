import type { ReleaseDraft } from '../types'

/** Who the release is for: the chosen challenge scenario, or the recipient the person described. */
export function recipientName(draft: ReleaseDraft) {
  return draft.scenarioId ?? (draft.custom.recipient.trim() || null)
}
