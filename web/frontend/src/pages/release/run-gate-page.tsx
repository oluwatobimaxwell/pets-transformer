import { useIsMutating } from '@tanstack/react-query'
import { getColumnsOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { draftView, RunStep, useDraft } from '@/features/release'
import { StepPage } from './step-page'

export default function RunGatePage() {
  const api = useDraft()
  const busy = useIsMutating() > 0
  const { data } = useApiQuery({ ...getColumnsOptions({ path: { dataset_id: api.draft.dataset?.id ?? '' } }), enabled: Boolean(api.draft.dataset) })
  return (
    <StepPage step={3} title="Run the release gate" view={draftView(3, api.draft, data, busy)}
      lead="A last look before the gate attacks the data. Nothing is released unless every check passes.">
      <RunStep api={api} />
    </StepPage>
  )
}
