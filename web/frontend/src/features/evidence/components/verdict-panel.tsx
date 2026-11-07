import { SimpleGrid, Stack, Text } from '@chakra-ui/react'
import type { EvidenceOut } from '@/api/generated'
import { formatScore, VerdictBanner } from '@/features/release'
import { gateSummary } from '../utils/gate-checks'
import { HeadlineTile } from './headline-tile'

/**
 * The decision and the numbers behind it, said once: the verdict, the attempt it came on, what stopped or holds it,
 * then the headline figures in one strip.
 */
export function VerdictPanel({ evidence }: { evidence: EvidenceOut }) {
  const attempts = evidence.attempts.length
  const { failed } = gateSummary(evidence.attempts.at(-1))
  const tiles = evidence.headline
  return (
    <Stack gap="3">
      <VerdictBanner status={evidence.status}>
        <Text textStyle="xs" color="fg.muted" pt="1">
          {attempts > 1 ? `Decided on attempt ${attempts} of ${attempts}.` : 'Decided on the first attempt.'}
          {evidence.composite !== null && evidence.composite !== undefined && ` Combined score ${formatScore(evidence.composite)}.`}
        </Text>
        {failed.length > 0 && (
          <Stack as="ul" gap="1" pt="2" listStyleType="disc" ps="4" textStyle="sm">
            {failed.map((check) => (
              <li key={check.name}><Text as="span" fontWeight="semibold">{check.name}.</Text> {check.detail}</li>
            ))}
          </Stack>
        )}
      </VerdictBanner>
      {tiles.length > 0 && (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: Math.min(tiles.length, 4) }} gap="1px" bg="border.muted" borderWidth="1px" borderColor="border" rounded="l3"
          overflow="hidden" css={{ '& > *': { background: 'var(--chakra-colors-bg-panel)' } }}>
          {tiles.map((tile) => <HeadlineTile key={tile.label} tile={tile} />)}
        </SimpleGrid>
      )}
    </Stack>
  )
}
