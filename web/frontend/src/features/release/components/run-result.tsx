import { Box, Heading, Stack } from '@chakra-ui/react'
import type { RunOut } from '@/api/generated'
import { StatusAlert } from '@/shared/components/status-alert'
import { dashboardUrl } from '../utils/run-links'
import { VERDICT_TEXT } from '../utils/verdict-text'
import { RunDownloads } from './run-downloads'
import { ScoreTiles } from './score-tiles'
import { TaskScores } from './task-scores'

/** What the gate decided, the numbers behind it, and the full evidence dashboard. */
export function RunResult({ run }: { run: RunOut }) {
  if (run.status === 'error') return <StatusAlert message={run.error || 'The run failed.'} />
  const verdict = VERDICT_TEXT[run.status]
  const summary = run.summary as Parameters<typeof ScoreTiles>[0]['summary'] & { tasks?: { id: string; description: string; score: number | null }[] }
  return (
    <Stack gap="6">
      {verdict && <StatusAlert status={verdict.status} message={verdict.message} />}
      <ScoreTiles summary={summary} />
      <RunDownloads runId={run.id} hasRelease={Boolean(run.has_release)} />
      <Stack gap="3">
        <Heading size="md">Questions the recipient needs answered</Heading>
        <TaskScores tasks={summary.tasks ?? []} />
      </Stack>
      <Stack gap="3">
        <Heading size="md">Evidence dashboard</Heading>
        <Box asChild borderWidth="1px" rounded="l2" width="full" height="80vh">
          <iframe src={dashboardUrl(run.id)} title="Evidence dashboard" />
        </Box>
      </Stack>
    </Stack>
  )
}
