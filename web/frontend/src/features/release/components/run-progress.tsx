import { Box, Circle, Flex, HStack, Spinner, Stack, Text } from '@chakra-ui/react'
import type { RunEventOut } from '@/api/generated'
import { stageIcon } from '../utils/stage-words'

interface RunProgressProps {
  events: RunEventOut[]
  running: boolean
}

/** Each stage as it happens, as a timeline: detect, select, tune, verify, then the decision. */
export function RunProgress({ events, running }: RunProgressProps) {
  return (
    <Box borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" p={{ base: '4', md: '5' }}>
      <Stack as="ol" gap="0" listStyleType="none" aria-live="polite" aria-label="Run progress">
        {events.map((event, index) => {
          const StageIcon = stageIcon(event.stage)
          const last = index === events.length - 1 && !running
          return (
            <Flex as="li" key={`${event.at}-${index}`} gap="3" animation="rise 180ms var(--chakra-easings-out)">
              <Stack align="center" gap="0">
                <Circle size="7" bg="bg.muted" color="fg.muted" flexShrink="0"><StageIcon size={14} aria-hidden="true" /></Circle>
                {!last && <Box aria-hidden="true" w="1px" flex="1" minH="3" bg="border" />}
              </Stack>
              <HStack flex="1" justify="space-between" align="start" gap="3" pb="3" pt="1" minW="0">
                <Stack gap="0" minW="0">
                  <Text textStyle="xs" fontFamily="mono" color="fg.muted">{event.stage}</Text>
                  <Text textStyle="sm">{event.message}</Text>
                </Stack>
                <Text textStyle="xs" color="fg.subtle" fontFamily="mono" flexShrink="0">{event.at.slice(11, 19)}</Text>
              </HStack>
            </Flex>
          )
        })}
        {running && (
          <Flex as="li" gap="3" align="center">
            <Circle size="7" bg="brand.subtle" color="brand.fg"><Spinner size="xs" /></Circle>
            <Text textStyle="sm" color="fg.muted">Working…</Text>
          </Flex>
        )}
      </Stack>
    </Box>
  )
}
