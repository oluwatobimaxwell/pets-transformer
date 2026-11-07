import { HStack, Progress, Stack, Text } from '@chakra-ui/react'
import { formatScore } from '../utils/format-score'
import { scorePalette } from '../utils/score-palette'

interface TaskScore {
  id: string
  description: string
  score: number | null
}

/** Each required question and how well the protected data still answers it. */
export function TaskScores({ tasks }: { tasks: TaskScore[] }) {
  if (!tasks.length) return null
  return (
    <Stack gap="3">
      {tasks.map((task) => (
        <Stack key={task.id} gap="1">
          <HStack justify="space-between" gap="4">
            <Text textStyle="sm"><Text as="span" fontFamily="mono" me="2">{task.id}</Text>{task.description}</Text>
            <Text fontWeight="semibold" fontFamily="mono">{task.score === null ? "can't answer" : formatScore(task.score)}</Text>
          </HStack>
          <Progress.Root value={(task.score ?? 0) * 100} size="xs" colorPalette={scorePalette(task.score)}>
            <Progress.Track><Progress.Range /></Progress.Track>
          </Progress.Root>
        </Stack>
      ))}
    </Stack>
  )
}
