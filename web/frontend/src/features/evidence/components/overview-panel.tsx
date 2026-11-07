import { Button, Grid, Stack } from '@chakra-ui/react'
import { ArrowRight } from 'lucide-react'
import type { EvidenceOut, RunOut } from '@/api/generated'
import { RunProgress, TaskScores } from '@/features/release'
import type { EvidenceTab } from '../utils/evidence-tabs'
import { AnswersGuarantee } from './answers-guarantee'
import { EvidenceCard } from './evidence-card'
import { GateSummary } from './gate-summary'
import { RemainingRisks } from './remaining-risks'

interface OverviewPanelProps {
  run: RunOut
  evidence: EvidenceOut
  onTab: (tab: EvidenceTab) => void
}

/** The run in one view: the questions it must still answer and the guarantee on the left; the gate, what remains and the timeline on the right. */
export function OverviewPanel({ run, evidence, onTab }: OverviewPanelProps) {
  const tasks = evidence.tasks.map((task) => ({ id: task.id, description: task.question, score: task.score, band: task.band }))
  return (
    <Grid templateColumns={{ base: 'minmax(0, 1fr)', xl: 'minmax(0, 1.55fr) minmax(0, 1fr)' }} gap="5" alignItems="start">
      <Stack gap="5" minW="0">
        {tasks.length > 0 && (
          <EvidenceCard title="Questions the recipient needs answered" flush
            description="Each is asked of the original and of the protected data. 1.00 means the same answer."
            action={<Button size="xs" variant="ghost" onClick={() => onTab('usefulness')}>Compare answers<ArrowRight aria-hidden="true" /></Button>}>
            <TaskScores tasks={tasks} />
          </EvidenceCard>
        )}
        {evidence.answers && <AnswersGuarantee answers={evidence.answers} />}
        <RemainingRisks notes={evidence.remaining} />
      </Stack>
      <Stack gap="5" minW="0">
        <GateSummary attempts={evidence.attempts} onOpen={() => onTab('gate')} />
        <EvidenceCard title="Timeline" description="Each stage of the run as it happened.">
          <RunProgress events={run.events} running={false} bare dense />
        </EvidenceCard>
      </Stack>
    </Grid>
  )
}
