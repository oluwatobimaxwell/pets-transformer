import { Link } from 'react-router-dom'
import { Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { listRunsOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { buildPath, Path } from '@/router/paths'
import { StatusBadge } from './status-badge'

/** Earlier runs on this machine, newest first. */
export function RecentRuns() {
  const { data } = useApiQuery(listRunsOptions())
  if (!data?.length) return null
  return (
    <Stack gap="3">
      <Heading size="md">Recent runs</Heading>
      <Stack as="ul" gap="2" listStyleType="none">
        {data.map((run) => (
          <HStack as="li" key={run.id} gap="3">
            <StatusBadge status={run.status} size="sm" />
            <Text asChild fontFamily="mono" textStyle="sm" textDecoration="underline">
              <Link to={buildPath(Path.Run, { runId: run.id })}>{run.scenario_id}</Link>
            </Text>
          </HStack>
        ))}
      </Stack>
    </Stack>
  )
}
