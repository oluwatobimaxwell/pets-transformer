import { ColumnsStep, useDraft } from '@/features/release'
import { StepPage } from './step-page'

export default function ColumnsPage() {
  const api = useDraft()
  return (
    <StepPage step={2} title="Check what Detect found"
      lead="Detect labelled every column from its values and name. Confirm or correct the ones it was unsure about; your decision overrides Detect's.">
      <ColumnsStep api={api} />
    </StepPage>
  )
}
