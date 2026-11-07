import { Stack } from '@chakra-ui/react'
import { PageHeader } from '@/shared/components/page-header'
import { EMPTY_VIEW, RecentRuns, usePublishView } from '@/features/release'

const VIEW = { ...EMPTY_VIEW, caption: 'Open a run to see its data sealed, held or blocked.' }

/** Every run on this machine, newest first, each with the gate's decision. */
export default function RunsPage() {
  usePublishView(VIEW)
  return (
    <Stack gap="8">
      <PageHeader title="Runs and results" description="Every release run on this machine, newest first, with the gate's decision and how useful the data stayed." />
      <RecentRuns />
    </Stack>
  )
}
