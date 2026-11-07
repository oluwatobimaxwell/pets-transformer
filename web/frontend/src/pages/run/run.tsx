import { Link, useParams } from 'react-router-dom'
import { Button, Skeleton, Stack } from '@chakra-ui/react'
import { ArrowLeft } from 'lucide-react'
import { Path } from '@/router/paths'
import { StatusAlert } from '@/shared/components/status-alert'
import { EMPTY_VIEW, RunProgress, statusWord, usePublishView, useRun } from '@/features/release'
import { EvidenceCard, EvidenceTabs, RunHeader, runViews, useEvidence, VerdictPanel } from '@/features/evidence'
import { RunSkeleton } from './run-skeleton'

/**
 * One run's page, which is its dashboard: who it's for, the decision and its numbers once, then the evidence in tabs.
 * While the gate works it shows the timeline; a failed run shows what went wrong.
 */
export default function RunPage() {
  const { runId = '' } = useParams()
  const { data: run, isLoading, errorMessage } = useRun(runId)
  const decided = Boolean(run && statusWord(run.status).finished && run.status !== 'error')
  const evidence = useEvidence(runId, decided)
  // The rail's model follows the run: it scans while the gate works, then shows the original and what the gate made of it
  usePublishView(run ? runViews(run, evidence.data) : { ...EMPTY_VIEW, scene: { ...EMPTY_VIEW.scene, busy: isLoading }, caption: 'Loading the run.' })

  if (isLoading) return <RunSkeleton />
  if (errorMessage || !run) {
    return (
      <Stack gap="4" align="start">
        <StatusAlert message={errorMessage ?? 'Run not found.'} />
        <Button asChild variant="outline"><Link to={Path.Runs}><ArrowLeft aria-hidden="true" />All runs</Link></Button>
      </Stack>
    )
  }
  const data = evidence.data
  return (
    <Stack gap="8">
      <RunHeader run={run} scenario={data?.scenario} generatedAt={data?.generated_at} engine={data?.engine} />
      {!statusWord(run.status).finished && (
        <EvidenceCard title="The gate is working" description="The evidence appears here as soon as it decides.">
          <RunProgress events={run.events} running bare />
        </EvidenceCard>
      )}
      {run.status === 'error' && (
        <Stack gap="5">
          <StatusAlert message={run.error || 'The run failed.'} />
          <EvidenceCard title="Timeline"><RunProgress events={run.events} running={false} bare /></EvidenceCard>
        </Stack>
      )}
      {decided && (evidence.errorMessage ? <StatusAlert message={evidence.errorMessage} /> : data ? (
        <>
          <VerdictPanel evidence={data} />
          <EvidenceTabs run={run} evidence={data} />
        </>
      ) : <Skeleton h="72" rounded="l3" />)}
    </Stack>
  )
}
