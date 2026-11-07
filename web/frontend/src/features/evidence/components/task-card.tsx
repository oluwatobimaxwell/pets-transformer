import { Badge, Box, Flex, Grid, HStack, Stack, Text } from '@chakra-ui/react'
import { TriangleAlert } from 'lucide-react'
import type { TaskEvidenceOut } from '@/api/generated'
import { formatScore, tonePalette } from '@/features/release'
import { formatMeasure } from '../utils/share-format'
import { ComparisonTable } from './comparison-table'
import { ScoreMeter } from './score-meter'

/**
 * One question the recipient needs answered: the score and its band first, then how it's scored and what changed,
 * with both answers side by side and the raw measurements one click away.
 */
export function TaskCard({ task }: { task: TaskEvidenceOut }) {
  const palette = tonePalette(task.band.tone)
  const facts = [{ name: 'Needs', value: task.needs }, { name: 'Metric', value: task.metric }, ...task.detail].filter((fact) => fact.value !== '')
  return (
    <Stack as="article" gap="0" bg="bg.panel" borderWidth="1px" borderColor="border" rounded="l3" overflow="hidden">
      <Flex gap="5" p={{ base: '4', md: '5' }} direction={{ base: 'column', md: 'row' }} justify="space-between">
        <Stack gap="2" minW="0" flex="1">
          <HStack gap="2"><Badge variant="outline" colorPalette="gray" fontFamily="mono">{task.id}</Badge></HStack>
          <Text as="h3" fontWeight="semibold" textStyle="md" letterSpacing="-0.01em">{task.question}</Text>
          <Text textStyle="sm" color="fg.muted" maxW="70ch">{task.scoring}</Text>
        </Stack>
        <Stack gap="2" w={{ base: 'full', md: '56' }} flexShrink="0" colorPalette={palette}>
          <HStack justify="space-between" align="baseline">
            <Text fontFamily="mono" fontSize="3xl" fontWeight="medium" letterSpacing="-0.03em" lineHeight="1">{task.score === null ? '–' : formatScore(task.score)}</Text>
            <Badge variant="subtle" size="md">{task.band.word}</Badge>
          </HStack>
          <ScoreMeter value={task.score} palette={palette} ticks label={`${task.id} scores ${formatScore(task.score)} of 1, ${task.band.word}`} />
          {task.band.meaning && <Text textStyle="xs" color="fg.muted">{task.band.meaning}</Text>}
        </Stack>
      </Flex>
      {(task.change || task.comparison.length > 0 || task.note) && (
        <Grid templateColumns={{ base: 'minmax(0, 1fr)', lg: task.comparison.length ? 'minmax(0, 1fr) minmax(0, 1.2fr)' : 'minmax(0, 1fr)' }} gap="4"
          px={{ base: '4', md: '5' }} pb={{ base: '4', md: '5' }}>
          <Stack gap="3">
            {task.change && (
              <Box borderStartWidth="2px" borderColor={`${palette}.solid`} ps="3">
                <Text textStyle="xs" fontWeight="semibold" color="fg.muted">What changed</Text>
                <Text textStyle="sm">{task.change}</Text>
              </Box>
            )}
            {task.note && (
              <HStack gap="2" align="start" textStyle="sm" colorPalette="orange" bg="colorPalette.subtle" color="colorPalette.fg" rounded="l2" p="3">
                <Box pt="0.5" flexShrink="0"><TriangleAlert size={15} aria-hidden="true" /></Box>
                <Text>{task.note}</Text>
              </HStack>
            )}
          </Stack>
          {task.comparison.length > 0 && <ComparisonTable rows={task.comparison} />}
        </Grid>
      )}
      {facts.length > 0 && (
        <Box as="details" borderTopWidth="1px" borderColor="border.muted" bg="bg.subtle"
          css={{ '& > summary': { cursor: 'pointer', listStyle: 'none' }, '& > summary::-webkit-details-marker': { display: 'none' }, '&[open] .chevron': { transform: 'rotate(90deg)' } }}>
          <Box as="summary" px={{ base: '4', md: '5' }} py="2.5" textStyle="xs" fontWeight="semibold" color="fg.muted" _hover={{ color: 'fg' }}>
            <Box as="span" className="chevron" display="inline-block" me="1.5" transition="transform 150ms">›</Box>How it's measured
          </Box>
          <Grid as="dl" templateColumns="max-content minmax(0, 1fr)" columnGap="6" rowGap="1.5" px={{ base: '4', md: '5' }} pb="4" textStyle="xs">
            {facts.map((fact) => (
              <Box key={fact.name} display="contents">
                <Text as="dt" color="fg.muted" textTransform="capitalize">{fact.name}</Text>
                <Text as="dd" m="0" fontFamily={typeof fact.value === 'number' ? 'mono' : undefined}>{formatMeasure(fact.value)}</Text>
              </Box>
            ))}
          </Grid>
        </Box>
      )}
    </Stack>
  )
}
