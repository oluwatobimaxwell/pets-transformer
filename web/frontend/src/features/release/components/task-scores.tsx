import { Badge, Box, HStack, Stack, Text } from '@chakra-ui/react'
import { formatScore } from '../utils/format-score'
import { tonePalette } from '../utils/tone-palette'

interface TaskScore {
  id: string
  description: string
  score: number | null
  /** The engine's reading of the score, such as "Close". Older runs don't have one. */
  band?: { word: string; tone: string }
}

/** Each required question and how well the protected data still answers it, as a number, a word and a bar. */
export function TaskScores({ tasks }: { tasks: TaskScore[] }) {
  if (!tasks.length) return null
  return (
    <Stack as="ul" gap="0" listStyleType="none" borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" divideY="1px" divideColor="border.muted">
      {tasks.map((task) => {
        const word = task.band?.word ?? ''
        return (
          <Stack as="li" key={task.id} gap="2" px={{ base: '4', md: '5' }} py="4" colorPalette={tonePalette(task.band?.tone)}>
            <HStack justify="space-between" gap="4" align="start">
              <HStack gap="2.5" align="start" minW="0">
                <Badge variant="outline" colorPalette="gray" fontFamily="mono" flexShrink="0">{task.id}</Badge>
                <Text textStyle="sm">{task.description}</Text>
              </HStack>
              <HStack gap="2" flexShrink="0">
                {word && <Badge variant="subtle" hideBelow="sm">{word}</Badge>}
                <Text fontWeight="semibold" fontFamily="mono" fontVariantNumeric="tabular-nums">{task.score === null ? "can't answer" : formatScore(task.score)}</Text>
              </HStack>
            </HStack>
            <Box h="1.5" rounded="full" bg="bg.muted" overflow="hidden" role="img" aria-label={`${task.id} scores ${formatScore(task.score)} of 1${word ? `, ${word}` : ''}`}>
              <Box h="full" w={`${(task.score ?? 0) * 100}%`} bg="colorPalette.solid" rounded="full" transformOrigin="left"
                animation="grow 600ms var(--chakra-easings-out)" />
            </Box>
          </Stack>
        )
      })}
    </Stack>
  )
}
