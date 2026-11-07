import { HStack, Progress, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Gauge, ListChecks, Lock, Rows3, ShieldCheck, type LucideIcon } from 'lucide-react'
import { formatPercent, formatScore } from '../utils/format-score'

interface ScoreTilesProps {
  summary: {
    scores?: { privacy?: number; utility?: number } | null
    rows?: { kept?: number; total?: number }
    answers?: { epsilon: number; contribution_bound: number; answered: number; questions: number } | null
  }
}

interface Tile {
  label: string
  value: string
  help: string
  icon: LucideIcon
  /** 0–1, drawn as a meter under the number. */
  meter?: number
}

/** The headline numbers of a finished run, each with what it means. */
export function ScoreTiles({ summary }: ScoreTilesProps) {
  const scores = summary.scores ?? {}
  const rows = summary.rows ?? {}
  const answers = summary.answers
  const tiles = [
    answers && { label: 'Privacy budget', value: `ε ${answers.epsilon}`, help: `Differential privacy, at most ${answers.contribution_bound} records per person`, icon: Lock },
    answers && { label: 'Answers published', value: `${answers.answered} of ${answers.questions}`, help: 'Noisy answers, not rows', icon: ListChecks },
    scores.privacy !== undefined && { label: 'Privacy', value: formatScore(scores.privacy), help: 'Public checks found no remaining risk at 1.00', icon: ShieldCheck, meter: scores.privacy },
    scores.utility !== undefined && { label: 'Usefulness', value: formatScore(scores.utility), help: 'Average score of the required questions', icon: Gauge, meter: scores.utility },
    rows.total ? { label: 'Rows kept', value: formatPercent((rows.kept ?? 0) / rows.total), help: `${(rows.kept ?? 0).toLocaleString()} of ${rows.total.toLocaleString()}`,
      icon: Rows3, meter: (rows.kept ?? 0) / rows.total } : false,
  ].filter(Boolean) as Tile[]
  return (
    <SimpleGrid columns={{ base: 1, sm: Math.min(tiles.length, 2), lg: tiles.length }} gap="3">
      {tiles.map((tile) => {
        const TileIcon = tile.icon
        return (
          <Stack key={tile.label} gap="2" borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" p="5">
            <HStack gap="2" color="fg.muted">
              <TileIcon size={16} aria-hidden="true" />
              <Text textStyle="sm" fontWeight="medium">{tile.label}</Text>
            </HStack>
            <Text textStyle="3xl" fontWeight="semibold" letterSpacing="display" fontVariantNumeric="tabular-nums" lineHeight="1.1">{tile.value}</Text>
            {tile.meter !== undefined && (
              <Progress.Root value={tile.meter * 100} size="xs" colorPalette="brand" aria-hidden="true">
                <Progress.Track><Progress.Range /></Progress.Track>
              </Progress.Root>
            )}
            <Text textStyle="xs" color="fg.muted">{tile.help}</Text>
          </Stack>
        )
      })}
    </SimpleGrid>
  )
}
