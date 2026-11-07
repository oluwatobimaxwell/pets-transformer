import { RunStep, useDraft } from '@/features/release'
import { StepPage } from './step-page'

export default function RunGatePage() {
  const api = useDraft()
  return (
    <StepPage step={3} title="Run the release gate"
      lead="A last look before the gate protects the data and attacks it. Nothing is released unless every check passes.">
      <RunStep api={api} />
    </StepPage>
  )
}
