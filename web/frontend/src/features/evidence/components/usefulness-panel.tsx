import { Stack, Text } from '@chakra-ui/react'
import { Gauge } from 'lucide-react'
import type { TaskEvidenceOut } from '@/api/generated'
import { EvidenceEmpty } from './evidence-empty'
import { TaskCard } from './task-card'

/** Every question this recipient must still be able to answer, each asked of the original and the protected data. */
export function UsefulnessPanel({ tasks }: { tasks: TaskEvidenceOut[] }) {
  if (!tasks.length) {
    return <EvidenceEmpty icon={Gauge} title="No required questions" text="This run had no question list, so usefulness wasn't measured. That happens for data outside the challenge package with no questions given." />
  }
  return (
    <Stack gap="4">
      <Text textStyle="sm" color="fg.muted" maxW="75ch">
        The engine asks each question of the original and the protected data, shows both answers, and scores how closely they match.
        Marks on each bar sit where Rough, Close and Same answer begin.
      </Text>
      {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
    </Stack>
  )
}
