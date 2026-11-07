import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import type { RunOut } from '@/api/generated'
import { StatusAlert } from '@/shared/components/status-alert'
import { useColorMode } from '@/shared/hooks/use-color-mode'
import { dashboardUrl } from '../utils/run-links'
import { RunDownloads } from './run-downloads'
import { ScoreTiles } from './score-tiles'
import { TaskScores } from './task-scores'
import { VerdictBanner } from './verdict-banner'

/** What the gate decided, the numbers behind it, and the full evidence dashboard. */
export function RunResult({ run }: { run: RunOut }) {
  const { colorMode } = useColorMode()
  if (run.status === 'error') return <StatusAlert message={run.error || 'The run failed.'} />
  const summary = run.summary as Parameters<typeof ScoreTiles>[0]['summary'] & { tasks?: Parameters<typeof TaskScores>[0]['tasks'] }
  return (
    <Stack gap="8">
      <Stack gap="4">
        <VerdictBanner status={run.status} />
        <ScoreTiles summary={summary} />
        <RunDownloads runId={run.id} hasRelease={Boolean(run.has_release)} />
      </Stack>
      <Stack gap="3">
        <Stack gap="0.5">
          <Heading as="h2" textStyle="lg">Questions the recipient needs answered</Heading>
          <Text textStyle="sm" color="fg.muted">Each is asked of the original and the protected data. 1.00 means the same answer.</Text>
        </Stack>
        <TaskScores tasks={summary.tasks ?? []} />
      </Stack>
      <Stack gap="3">
        <Heading as="h2" textStyle="lg">Evidence dashboard</Heading>
        <Box asChild borderWidth="1px" borderColor="border" rounded="l3" width="full" height="80vh" overflow="hidden" bg="bg.panel">
          <iframe src={dashboardUrl(run.id, colorMode)} title="Evidence dashboard" />
        </Box>
      </Stack>
    </Stack>
  )
}
