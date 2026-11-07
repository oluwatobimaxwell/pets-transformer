import { RecipientStep, useDraft } from '@/features/release'
import { StepPage } from './step-page'

export default function RecipientPage() {
  const api = useDraft()
  return (
    <StepPage step={1} title="Who receives it, and why"
      lead="Pick the challenge scenario that matches who will get the data, with its questions and limits already set. Or describe your own recipient: who they are, how far they are trusted and what they must still be able to answer."
      blockedBy="Name the recipient or choose a scenario to continue">
      <RecipientStep api={api} />
    </StepPage>
  )
}
