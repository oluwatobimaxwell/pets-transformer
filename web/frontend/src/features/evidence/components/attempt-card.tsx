import { Box, HStack, Stack, Text } from '@chakra-ui/react'
import type { GateAttemptOut } from '@/api/generated'
import { StatusBadge } from '@/features/release'
import { gateSummary, orderChecks } from '../utils/gate-checks'
import { CheckRow } from './check-row'

interface AttemptCardProps {
  attempt: GateAttemptOut
  /** The attempt that decided; earlier ones start folded. */
  final: boolean
}

/** One pass of the gate: its result, a count of its checks, and every check with failures first. */
export function AttemptCard({ attempt, final }: AttemptCardProps) {
  const { passed, failed, notes } = gateSummary(attempt)
  return (
    <Box asChild bg="bg.panel" borderWidth="1px" borderColor="border" rounded="l3" overflow="hidden"
      css={{ '& > summary': { listStyle: 'none', cursor: 'pointer' }, '& > summary::-webkit-details-marker': { display: 'none' }, '&[open] .chevron': { transform: 'rotate(90deg)' } }}>
      <details open={final}>
        <HStack as="summary" gap="3" px={{ base: '4', md: '5' }} py="4" flexWrap="wrap" _hover={{ bg: 'bg.subtle' }}>
          <Box as="span" className="chevron" color="fg.muted" transition="transform 150ms" aria-hidden="true">›</Box>
          <Text fontWeight="semibold">Attempt {attempt.attempt}{final ? ', the one that decided' : ''}</Text>
          <StatusBadge status={attempt.status} size="sm" />
          <Text textStyle="xs" color="fg.muted" ms="auto" fontFamily="mono">
            {passed.length} passed · {failed.length} failed{notes.length ? ` · ${notes.length} ${notes.length === 1 ? 'note' : 'notes'}` : ''}
          </Text>
        </HStack>
        <Stack as="ul" gap="0" listStyleType="none" divideY="1px" divideColor="border.muted" borderTopWidth="1px" borderColor="border.muted">
          {orderChecks(attempt.checks).map((check) => <CheckRow key={check.name} check={check} />)}
        </Stack>
      </details>
    </Box>
  )
}
