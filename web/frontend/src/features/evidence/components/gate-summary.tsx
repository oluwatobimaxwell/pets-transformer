import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react'
import { ArrowRight, CircleCheck, CircleX } from 'lucide-react'
import type { GateAttemptOut } from '@/api/generated'
import { gateSummary } from '../utils/gate-checks'
import { EvidenceCard } from './evidence-card'

interface GateSummaryProps {
  attempts: GateAttemptOut[]
  onOpen: () => void
}

/** The final attempt's checks at a glance: how many passed, what failed, and how earlier attempts ended. */
export function GateSummary({ attempts, onOpen }: GateSummaryProps) {
  const last = attempts.at(-1)
  const { total, passed, failed, notes } = gateSummary(last)
  const earlier = attempts.slice(0, -1).map((attempt) => ({ attempt: attempt.attempt, failed: gateSummary(attempt).failed }))
  const graded = passed.length + failed.length
  return (
    <EvidenceCard title="Gate checks" description="Every check runs on every attempt, and the worst result decides."
      action={<Button size="xs" variant="ghost" onClick={onOpen}>All checks<ArrowRight aria-hidden="true" /></Button>}>
      <Stack gap="4">
        <HStack gap="3" align="baseline">
          <Text fontFamily="mono" fontSize="3xl" fontWeight="medium" letterSpacing="-0.03em" lineHeight="1">{passed.length}</Text>
          <Text textStyle="sm" color="fg.muted">of {graded} checks passed{notes.length ? `, ${notes.length} ${notes.length === 1 ? 'note' : 'notes'}` : ''}</Text>
        </HStack>
        {total > 0 && (
          <HStack gap="0.5" h="2" rounded="full" overflow="hidden" aria-hidden="true">
            {passed.length > 0 && <Box flex={passed.length} h="full" bg="brand.solid" />}
            {failed.length > 0 && <Box flex={failed.length} h="full" bg="red.solid" />}
            {notes.length > 0 && <Box flex={notes.length} h="full" bg="border.emphasized" />}
          </HStack>
        )}
        {failed.length > 0 ? (
          <Stack as="ul" gap="2" listStyleType="none">
            {failed.map((check) => (
              <HStack as="li" key={check.name} gap="2" align="start" textStyle="sm">
                <Box color="red.fg" pt="0.5" flexShrink="0"><CircleX size={15} aria-hidden="true" /></Box>
                <Text><Text as="span" fontWeight="semibold">{check.name}.</Text> <Text as="span" color="fg.muted">{check.detail}</Text></Text>
              </HStack>
            ))}
          </Stack>
        ) : total > 0 && (
          <HStack gap="2" textStyle="sm" color="brand.fg"><CircleCheck size={15} aria-hidden="true" />Every check that can stop a release passed.</HStack>
        )}
        {earlier.length > 0 && (
          <Stack gap="1.5" pt="3" borderTopWidth="1px" borderColor="border.muted" textStyle="xs" color="fg.muted">
            {earlier.map(({ attempt, failed: missed }) => (
              <Text key={attempt}>
                Attempt {attempt} was sent back{missed.length ? `: ${missed.map((check) => check.name.toLowerCase()).join(', ')}` : ''}.
              </Text>
            ))}
          </Stack>
        )}
      </Stack>
    </EvidenceCard>
  )
}
