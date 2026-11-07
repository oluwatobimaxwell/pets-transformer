import { useNavigate } from 'react-router-dom'
import type { DatasetOut } from '@/api/generated'
import { Path } from '@/router/paths'
import { DataStep, useDraft } from '@/features/release'
import { StepPage } from './step-page'

export default function DataPage() {
  const api = useDraft()
  const navigate = useNavigate()
  const registered = (dataset: DatasetOut) => {
    api.chooseDataset(dataset)
    navigate(Path.ReleaseRecipient)
  }
  return (
    <StepPage step={0} title="Protect a dataset" blockedBy="Upload CSV files or pick a challenge dataset to continue"
      lead="Choose the data you want to share. Upload your own CSV files, or start with one of the challenge's synthetic datasets.">
      <DataStep onRegistered={registered} chosen={api.draft.dataset?.name} />
    </StepPage>
  )
}
