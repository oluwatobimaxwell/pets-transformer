import { HStack, Spinner, Stack, Text } from '@chakra-ui/react'
import type { RunEventOut } from '@/api/generated'

interface RunProgressProps {
  events: RunEventOut[]
  running: boolean
}

/** Each stage as it happens: detect, select, tune, transform, verify. */
export function RunProgress({ events, running }: RunProgressProps) {
  return (
    <Stack as="ol" gap="1.5" listStyleType="none" aria-live="polite">
      {events.map((event, index) => (
        <HStack as="li" key={`${event.at}-${index}`} gap="3" align="start">
          <Text textStyle="xs" color="fg.muted" fontFamily="mono" minW="16">{event.at.slice(11, 19)}</Text>
          <Text textStyle="xs" fontFamily="mono" color="colorPalette.fg" minW="16">{event.stage}</Text>
          <Text textStyle="sm">{event.message}</Text>
        </HStack>
      ))}
      {running && (
        <HStack as="li" gap="3">
          <Spinner size="xs" />
          <Text textStyle="sm" color="fg.muted">Working…</Text>
        </HStack>
      )}
    </Stack>
  )
}
