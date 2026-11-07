import { useNavigate } from 'react-router-dom'
import { useIsMutating } from '@tanstack/react-query'
import { Stack } from '@chakra-ui/react'
import type { DatasetOut } from '@/api/generated'
import { Path } from '@/router/paths'
import { DataStep, draftView, RecentRuns, useDraft } from '@/features/release'
import { StepPage } from './step-page'

export default function DataPage() {
  const api = useDraft()
  const navigate = useNavigate()
  const busy = useIsMutating() > 0
  const registered = (dataset: DatasetOut) => {
    api.chooseDataset(dataset)
    navigate(Path.ReleaseRecipient)
  }
  return (
    <StepPage step={0} title="Protect a dataset" view={draftView(0, api.draft, undefined, busy)}
      lead="Upload data, say who receives it, check what was found, and let the gate decide what may be released.">
      <Stack gap={{ base: '10', md: '12' }}>
        <DataStep onRegistered={registered} />
        <RecentRuns />
      </Stack>
    </StepPage>
  )
}
