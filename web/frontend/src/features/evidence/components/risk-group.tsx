import { Badge, Grid, HStack, Stack, Text } from '@chakra-ui/react'
import type { RiskOut } from '@/api/generated'
import { tonePalette } from '@/features/release'
import { riskTone } from '../utils/risk-tone'
import { formatRisk } from '../utils/share-format'
import { EvidenceCard } from './evidence-card'
import { ScoreMeter } from './score-meter'

/** One table's scorecard risks, worst first, each with what it measures. */
export function RiskGroup({ table, risks }: { table: string; risks: RiskOut[] }) {
  return (
    <EvidenceCard flush title={<Text as="span" fontFamily="mono">{table}</Text>}>
      <Stack as="ul" gap="0" listStyleType="none" divideY="1px" divideColor="border.muted">
        {risks.map((risk) => {
          const { tone, word } = riskTone(risk.value)
          const palette = tonePalette(tone)
          return (
            <Grid as="li" key={risk.metric} templateColumns={{ base: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) 13rem' }} gap="4" px={{ base: '4', md: '5' }} py="4">
              <Stack gap="1" minW="0">
                <Text fontWeight="semibold" textStyle="sm">{risk.name}</Text>
                <Text textStyle="sm" color="fg.muted">{risk.meaning}</Text>
              </Stack>
              <Stack gap="2" colorPalette={palette}>
                <HStack justify="space-between" align="baseline">
                  <Text fontFamily="mono" fontWeight="medium" textStyle="lg">{formatRisk(risk.value)}</Text>
                  <Badge variant="subtle">{word}</Badge>
                </HStack>
                <ScoreMeter value={risk.value} palette={palette} label={`${risk.name}: ${formatRisk(risk.value)}, ${word}`} />
              </Stack>
            </Grid>
          )
        })}
      </Stack>
    </EvidenceCard>
  )
}
