import { Link, useMatch } from 'react-router-dom'
import { Box, HStack, Stack, Text } from '@chakra-ui/react'
import { listRunsOptions } from '@/api/generated/@tanstack/react-query.gen'
import { buildPath, Path } from '@/router/paths'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { runFacts } from '../utils/run-facts'
import { statusWord } from '../utils/status-words'

const SHOWN = 8

/** The latest runs, so moving between them takes one click. The one on screen is marked. */
export function RailRuns() {
  const { data } = useApiQuery(listRunsOptions())
  const current = useMatch(Path.Run)?.params.runId
  if (!data?.length) return null
  return (
    <Stack as="nav" aria-label="Recent runs" gap="1">
      <Text px="2.5" pb="1" textStyle="xs" fontWeight="semibold" color="deep.muted" letterSpacing="0.06em" textTransform="uppercase">Recent runs</Text>
      <Stack as="ul" gap="0.5" listStyleType="none">
        {data.slice(0, SHOWN).map((run) => {
          const word = statusWord(run.status)
          const StatusIcon = word.icon
          const on = run.id === current
          return (
            <li key={run.id}>
              <HStack asChild gap="2.5" px="2.5" py="1.5" rounded="l2" bg={on ? 'deep.raised' : 'transparent'} color={on ? 'white' : 'deep.fg'}
                _hover={on ? undefined : { bg: 'rgba(234,243,239,0.05)' }} transition="background 200ms">
                <Link to={buildPath(Path.Run, { runId: run.id })} aria-current={on ? 'page' : undefined} aria-label={`${run.scenario_id}, ${word.label}`}>
                  <Box color={word.deep} flexShrink="0"><StatusIcon size={14} aria-hidden="true" /></Box>
                  <Text flex="1" minW="0" truncate fontFamily="mono" textStyle="sm" fontWeight={on ? 'semibold' : 'medium'}>{run.scenario_id}</Text>
                  <Text textStyle="xs" color="deep.muted" fontFamily="mono" flexShrink="0">{runFacts(run).started.slice(11)}</Text>
                </Link>
              </HStack>
            </li>
          )
        })}
      </Stack>
    </Stack>
  )
}
