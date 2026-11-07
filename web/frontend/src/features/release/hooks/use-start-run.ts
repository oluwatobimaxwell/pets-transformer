import { useNavigate } from 'react-router-dom'
import { startRunMutation } from '@/api/generated/@tanstack/react-query.gen'
import { useApiMutation } from '@/shared/hooks/use-api-mutation'
import { buildPath, Path } from '@/router/paths'
import type { ReleaseDraft } from '../types'
import { filledQuestion } from '../utils/empty-question'

/** Sends the draft to the release gate, then opens the run's page. `onStarted` clears the draft for the next release. */
export function useStartRun(onStarted?: () => void) {
  const navigate = useNavigate()
  const mutation = useApiMutation({
    ...startRunMutation(),
    onSuccess: (run) => {
      navigate(buildPath(Path.Run, { runId: run.id }))
      onStarted?.()
    },
  })
  const start = (draft: ReleaseDraft) => {
    if (!draft.dataset) return
    const custom = draft.scenarioId ? undefined : { ...draft.custom, questions: (draft.custom.questions ?? []).map(filledQuestion) }
    mutation.mutate({ body: { dataset_id: draft.dataset.id, scenario_id: draft.scenarioId, custom, review: draft.decisions } })
  }
  return { start, isStarting: mutation.isPending, errorMessage: mutation.errorMessage }
}
