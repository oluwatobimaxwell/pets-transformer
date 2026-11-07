import { Badge, Box, Circle, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import type { RunEventOut } from '@/api/generated'
import { CubeSpinner } from '@/shared/components/motion/cube-spinner'
import { stageIcon, stagePalette } from '../utils/stage-words'

interface RunProgressProps {
  events: RunEventOut[]
  running: boolean
}

/** Each stage as it happens, as a timeline: detect, select, tune, verify, then the decision. Each stage has its own tag colour. */
export function RunProgress({ events, running }: RunProgressProps) {
  return (
    <Box borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" p={{ base: '4', md: '5' }}>
      <Stack as="ol" gap="0" listStyleType="none" aria-live="polite" aria-label="Run progress">
        {events.map((event, index) => {
          const StageIcon = stageIcon(event.stage)
          const palette = stagePalette(event.stage)
          const last = index === events.length - 1 && !running
          return (
            <Flex as="li" key={`${event.at}-${index}`} gap="3" animation="rise 220ms var(--chakra-easings-out)">
              <Stack align="center" gap="0">
                <Circle size="7" colorPalette={palette} bg="colorPalette.subtle" color="colorPalette.fg" flexShrink="0">
                  <StageIcon size={14} aria-hidden="true" />
                </Circle>
                {!last && <Box aria-hidden="true" w="1px" flex="1" minH="3" bg="border" />}
              </Stack>
              <HStack flex="1" justify="space-between" align="start" gap="3" pb="3" pt="0.5" minW="0">
                <Stack gap="1" minW="0">
                  <Badge colorPalette={palette} variant="subtle" size="sm" fontFamily="mono" alignSelf="start">{event.stage}</Badge>
                  <Text textStyle="sm">{event.message}</Text>
                </Stack>
                <Text textStyle="xs" color="fg.subtle" fontFamily="mono" flexShrink="0">{event.at.slice(11, 19)}</Text>
              </HStack>
            </Flex>
          )
        })}
        {running && (
          <Flex as="li" gap="3" align="center">
            <Circle size="7" bg="brand.subtle" color="brand.fg"><CubeSpinner /></Circle>
            <Text textStyle="sm" color="fg.muted">Working…</Text>
          </Flex>
        )}
      </Stack>
    </Box>
  )
}
