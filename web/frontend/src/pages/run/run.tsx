import { Link, useParams } from 'react-router-dom'
import { Button, Skeleton, Stack } from '@chakra-ui/react'
import { ArrowLeft } from 'lucide-react'
import { Path } from '@/router/paths'
import { PageHeader } from '@/shared/components/page-header'
import { StatusAlert } from '@/shared/components/status-alert'
import { EMPTY_VIEW, RunProgress, RunResult, runView, StatusBadge, statusWord, usePublishView, useRun } from '@/features/release'

export default function RunPage() {
  const { runId = '' } = useParams()
  const { data: run, isLoading, errorMessage } = useRun(runId)
  // The rail's model follows the run: it scans while the gate works, then shows the decision
  usePublishView(run ? runView(run) : { ...EMPTY_VIEW, scene: { ...EMPTY_VIEW.scene, busy: isLoading }, caption: 'Loading the run.' })
  if (isLoading) {
    return (
      <Stack gap="6" aria-busy="true" aria-label="Loading the run">
        <Skeleton h="10" w="72" rounded="l2" />
        <Skeleton h="48" rounded="l3" />
      </Stack>
    )
  }
  if (errorMessage || !run) {
    return (
      <Stack gap="4" align="start">
        <StatusAlert message={errorMessage ?? 'Run not found.'} />
        <Button asChild variant="outline"><Link to={Path.Runs}><ArrowLeft aria-hidden="true" />All runs</Link></Button>
      </Stack>
    )
  }
  const finished = statusWord(run.status).finished
  return (
    <Stack gap="8">
      <PageHeader title={`Release for ${run.scenario_id}`} description={`Run ${run.id}`} actions={<StatusBadge status={run.status} size="lg" />} />
      {finished && <RunResult run={run} />}
      <RunProgress events={run.events} running={!finished} />
    </Stack>
  )
}
