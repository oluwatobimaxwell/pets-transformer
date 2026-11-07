import { useParams } from 'react-router-dom'
import { Separator, Stack } from '@chakra-ui/react'
import { PageHeader } from '@/shared/components/page-header'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import { StatusAlert } from '@/shared/components/status-alert'
import { RunProgress, RunResult, StatusBadge, statusWord, useRun } from '@/features/release'

export default function RunPage() {
  const { runId = '' } = useParams()
  const { data: run, isLoading, errorMessage } = useRun(runId)
  if (isLoading) return <LoadingSpinner />
  if (errorMessage || !run) return <StatusAlert message={errorMessage ?? 'Run not found.'} />
  const finished = statusWord(run.status).finished
  return (
    <Stack gap="8">
      <PageHeader title={`Release for ${run.scenario_id}`} description={`Run ${run.id}`} actions={<StatusBadge status={run.status} size="lg" />} />
      <RunProgress events={run.events} running={!finished} />
      {finished && (
        <>
          <Separator />
          <RunResult run={run} />
        </>
      )}
    </Stack>
  )
}
