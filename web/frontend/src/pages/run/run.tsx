import { useParams } from 'react-router-dom'
import { Skeleton, Stack } from '@chakra-ui/react'
import { PageHeader } from '@/shared/components/page-header'
import { StatusAlert } from '@/shared/components/status-alert'
import { RunProgress, RunResult, StatusBadge, statusWord, useRun } from '@/features/release'

export default function RunPage() {
  const { runId = '' } = useParams()
  const { data: run, isLoading, errorMessage } = useRun(runId)
  if (isLoading) {
    return (
      <Stack gap="6" aria-busy="true" aria-label="Loading the run">
        <Skeleton h="10" w="72" rounded="l2" />
        <Skeleton h="48" rounded="l3" />
      </Stack>
    )
  }
  if (errorMessage || !run) return <StatusAlert message={errorMessage ?? 'Run not found.'} />
  const finished = statusWord(run.status).finished
  return (
    <Stack gap="8">
      <PageHeader title={`Release for ${run.scenario_id}`} description={`Run ${run.id}`} actions={<StatusBadge status={run.status} size="lg" />} />
      {finished && <RunResult run={run} />}
      <RunProgress events={run.events} running={!finished} />
    </Stack>
  )
}
