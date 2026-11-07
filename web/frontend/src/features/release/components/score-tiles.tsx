import { Box, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Gauge, ListChecks, Lock, Rows3, ShieldCheck, type LucideIcon } from 'lucide-react'
import { CountUp } from '@/shared/components/motion/count-up'
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
  /** The number, counted up from zero when the tile appears. */
  value: number
  format: (value: number) => string
  help: string
  icon: LucideIcon
  /** 0–1, drawn as a meter under the number. */
  meter?: number
  palette: string
}

/** The headline numbers of a finished run, each with what it means. Privacy is forest, usefulness blue, rows teal. */
export function ScoreTiles({ summary }: ScoreTilesProps) {
  const scores = summary.scores ?? {}
  const rows = summary.rows ?? {}
  const answers = summary.answers
  const tiles = [
    answers && { label: 'Privacy budget', value: answers.epsilon, format: (v: number) => `ε ${Number(v.toFixed(2))}`,
      help: `Differential privacy, at most ${answers.contribution_bound} records per person`, icon: Lock, palette: 'brand' },
    answers && { label: 'Answers published', value: answers.answered, format: (v: number) => `${Math.round(v)} of ${answers.questions}`,
      help: 'Noisy answers, not rows', icon: ListChecks, palette: 'teal' },
    scores.privacy !== undefined && { label: 'Privacy', value: scores.privacy, format: formatScore,
      help: 'Public checks found no remaining risk at 1.00', icon: ShieldCheck, meter: scores.privacy, palette: 'brand' },
    scores.utility !== undefined && { label: 'Usefulness', value: scores.utility, format: formatScore,
      help: 'Average score of the required questions', icon: Gauge, meter: scores.utility, palette: 'blue' },
    rows.total ? { label: 'Rows kept', value: (rows.kept ?? 0) / rows.total, format: formatPercent,
      help: `${(rows.kept ?? 0).toLocaleString()} of ${rows.total.toLocaleString()}`, icon: Rows3, meter: (rows.kept ?? 0) / rows.total, palette: 'teal' } : false,
  ].filter(Boolean) as Tile[]
  return (
    <SimpleGrid columns={{ base: 1, sm: Math.min(tiles.length, 2), lg: tiles.length }} gap="3" className="stagger">
      {tiles.map((tile) => {
        const TileIcon = tile.icon
        return (
          <Stack key={tile.label} gap="2.5" borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" p="5" colorPalette={tile.palette}>
            <HStack gap="2" color="fg.muted">
              <Box display="grid" placeItems="center" boxSize="7" rounded="l1" bg="colorPalette.subtle" color="colorPalette.fg">
                <TileIcon size={15} aria-hidden="true" />
              </Box>
              <Text textStyle="sm" fontWeight="semibold">{tile.label}</Text>
            </HStack>
            <Text fontFamily="mono" textStyle="3xl" fontWeight="medium" letterSpacing="-0.02em" lineHeight="1.1">
              <CountUp value={tile.value} format={tile.format} />
            </Text>
            {tile.meter !== undefined && (
              <Box h="2" bg="bg.muted" rounded="full" overflow="hidden" aria-hidden="true">
                <Box h="full" w={`${Math.max(0, Math.min(1, tile.meter)) * 100}%`} bg="colorPalette.solid" rounded="full"
                  transformOrigin="left" animation="grow 0.9s var(--chakra-easings-out) backwards" />
              </Box>
            )}
            <Text textStyle="xs" color="fg.muted">{tile.help}</Text>
          </Stack>
        )
      })}
    </SimpleGrid>
  )
}
