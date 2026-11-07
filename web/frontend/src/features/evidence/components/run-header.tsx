import { Link } from 'react-router-dom'
import { Badge, Box, Flex, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { ArrowLeft } from 'lucide-react'
import type { RunOut, ScenarioEvidenceOut } from '@/api/generated'
import { Path } from '@/router/paths'
import { RunDownloads, trustWord } from '@/features/release'
import { formatMoment, runDuration } from '../utils/run-timing'

interface RunHeaderProps {
  run: RunOut
  /** Who the release is for, once the evidence is in. */
  scenario?: ScenarioEvidenceOut
  generatedAt?: string
  engine?: string
}

/** Who the release is for and why, the facts of the run in one quiet line, and what may be downloaded. */
export function RunHeader({ run, scenario, generatedAt, engine }: RunHeaderProps) {
  const trust = scenario ? trustWord(scenario.trust_level) : null
  const TrustIcon = trust?.icon
  const duration = runDuration(run.events)
  const facts = [
    { label: 'Run', value: run.id, mono: true },
    generatedAt && { label: 'Decided', value: formatMoment(generatedAt) },
    duration && { label: 'Took', value: duration },
    scenario && { label: 'Look-alike bar', value: scenario.k_required ? `${scenario.k_required} per row` : 'None set' },
    engine && { label: 'Engine', value: engine, mono: true },
  ].filter(Boolean) as { label: string; value: string; mono?: boolean }[]

  return (
    <Stack gap="5">
      <Box asChild alignSelf="start" display="inline-flex" alignItems="center" gap="1.5" textStyle="sm" color="fg.muted" _hover={{ color: 'fg' }}>
        <Link to={Path.Runs}><ArrowLeft size={14} aria-hidden="true" />Runs and results</Link>
      </Box>
      <Flex gap="6" justify="space-between" align={{ base: 'start', md: 'end' }} direction={{ base: 'column', md: 'row' }}>
        <Stack gap="3" minW="0" maxW="3xl">
          <HStack gap="2" flexWrap="wrap">
            <Badge variant="outline" colorPalette="gray" fontFamily="mono" size="md">{scenario?.id ?? run.scenario_id}</Badge>
            {trust && TrustIcon && (
              <Badge variant="subtle" colorPalette={trust.palette} size="md"><TrustIcon size={12} aria-hidden="true" />{trust.label}</Badge>
            )}
          </HStack>
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" letterSpacing="-0.022em" lineHeight="1.15">
            {scenario?.recipient ?? `Release for ${run.scenario_id}`}
          </Heading>
          {scenario?.purpose && <Text color="fg.muted" textStyle={{ base: 'sm', md: 'md' }} maxW="70ch">{scenario.purpose.replace(/\.+$/, '')}.</Text>}
        </Stack>
        {run.status !== 'queued' && run.status !== 'running' && <Box flexShrink="0"><RunDownloads runId={run.id} hasRelease={Boolean(run.has_release)} /></Box>}
      </Flex>
      <Flex as="dl" gap="0" flexWrap="wrap" rowGap="2" textStyle="xs" color="fg.muted" borderTopWidth="1px" borderColor="border" pt="4">
        {facts.map((fact, index) => (
          <HStack key={fact.label} gap="1.5" pe="5" me="5" borderEndWidth={index < facts.length - 1 ? '1px' : '0'} borderColor="border">
            <Text as="dt">{fact.label}</Text>
            <Text as="dd" m="0" color="fg" fontWeight="medium" fontFamily={fact.mono ? 'mono' : undefined}>{fact.value}</Text>
          </HStack>
        ))}
      </Flex>
    </Stack>
  )
}
