import { Link } from 'react-router-dom'
import { Box, EmptyState, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { ChevronRight, History } from 'lucide-react'
import { listRunsOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { buildPath, Path } from '@/router/paths'
import { formatScore } from '../utils/format-score'
import { runFacts } from '../utils/run-facts'
import { StatusBadge } from './status-badge'

/** Earlier runs on this machine, newest first. */
export function RecentRuns() {
  const { data, isLoading } = useApiQuery(listRunsOptions())
  if (isLoading) return null
  return (
    <Stack gap="3">
      <Heading as="h2" textStyle="md">Recent runs</Heading>
      {!data?.length ? (
        <EmptyState.Root size="sm" borderWidth="1px" borderStyle="dashed" borderColor="border.emphasized" rounded="l3">
          <EmptyState.Content>
            <EmptyState.Indicator><History /></EmptyState.Indicator>
            <EmptyState.Title>No runs yet</EmptyState.Title>
            <EmptyState.Description>Each release you run appears here with the gate's decision.</EmptyState.Description>
          </EmptyState.Content>
        </EmptyState.Root>
      ) : (
        <Stack as="ul" gap="0" listStyleType="none" borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" overflow="hidden" divideY="1px" divideColor="border.muted">
          {data.map((run) => {
            const facts = runFacts(run)
            return (
              <Box as="li" key={run.id}>
                <HStack asChild gap="3" px="4" py="3" _hover={{ bg: 'bg.subtle' }} transition="background 180ms" css={{ '&:hover .go': { color: 'fg' } }}>
                  <Link to={buildPath(Path.Run, { runId: run.id })}>
                    <Box w={{ base: 'auto', md: '56' }} flexShrink="0"><StatusBadge status={run.status} size="sm" /></Box>
                    <Stack gap="0" flex="1" minW="0">
                      <Text fontFamily="mono" textStyle="sm" fontWeight="medium" truncate>{run.scenario_id}</Text>
                      <Text textStyle="xs" color="fg.muted" fontFamily="mono" truncate>{run.id}{facts.started && ` · ${facts.started}`}</Text>
                    </Stack>
                    {facts.utility !== null && (
                      <Text textStyle="xs" color="fg.muted" hideBelow="sm" fontVariantNumeric="tabular-nums">Usefulness <Text as="span" color="fg" fontWeight="semibold">{formatScore(facts.utility)}</Text></Text>
                    )}
                    <Box className="go" color="fg.subtle" transition="color 180ms"><ChevronRight size={16} aria-hidden="true" /></Box>
                  </Link>
                </HStack>
              </Box>
            )
          })}
        </Stack>
      )}
    </Stack>
  )
}
