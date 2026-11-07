import { getColumnsOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { ColumnsStep, draftView, useDraft } from '@/features/release'
import { StepPage } from './step-page'

export default function ColumnsPage() {
  const api = useDraft()
  // The same query ColumnsStep reads, so it is fetched once; the rail layers the model by what it finds
  const { data } = useApiQuery({ ...getColumnsOptions({ path: { dataset_id: api.draft.dataset?.id ?? '' } }), enabled: Boolean(api.draft.dataset) })
  return (
    <StepPage step={2} title="Check what Detect found" view={draftView(2, api.draft, data, false)}
      lead="Detect labelled every column from its values and name. Confirm or correct the ones it was unsure about; your decision overrides Detect's.">
      <ColumnsStep api={api} />
    </StepPage>
  )
}
