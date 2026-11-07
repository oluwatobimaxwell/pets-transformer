import { draftView, RecipientStep, useDraft } from '@/features/release'
import { StepPage } from './step-page'

export default function RecipientPage() {
  const api = useDraft()
  return (
    <StepPage step={1} title="Who receives it, and why" view={draftView(1, api.draft, undefined, false)}
      lead="The gate protects data for one recipient. Describe them and the questions they must still be able to answer, or pick a challenge scenario."
      blockedBy="Name the recipient or choose a scenario to continue">
      <RecipientStep api={api} />
    </StepPage>
  )
}
