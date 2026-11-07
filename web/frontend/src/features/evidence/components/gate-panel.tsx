import { Stack, Text } from '@chakra-ui/react'
import type { GateAttemptOut } from '@/api/generated'
import { AttemptCard } from './attempt-card'

/** Every attempt of the gate, the deciding one first and open. A row that stands out sends the release back for another attempt. */
export function GatePanel({ attempts }: { attempts: GateAttemptOut[] }) {
  const newestFirst = [...attempts].reverse()
  return (
    <Stack gap="4">
      <Text textStyle="sm" color="fg.muted" maxW="75ch">
        Every check runs on every attempt, and the worst result decides. A failed check that blocks sends the release back for
        another attempt with coarser settings, or stops it.
      </Text>
      {newestFirst.map((attempt, index) => <AttemptCard key={attempt.attempt} attempt={attempt} final={index === 0} />)}
    </Stack>
  )
}
