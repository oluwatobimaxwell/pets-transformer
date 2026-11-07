import { Box, Circle, HStack, Spinner, Stack, Text } from '@chakra-ui/react'
import { Check } from 'lucide-react'
import type { RunEventOut } from '@/api/generated'
import { stageMessage, stageStates, trackerStages } from '../utils/gate-progress'
import { stageIcon } from '../utils/stage-words'

interface GateTrackerProps {
  events: RunEventOut[]
  finished: boolean
}

/** The gate's stages as a vertical track: done ones ticked, the current one working, with what the engine last said under each. */
export function GateTracker({ events, finished }: GateTrackerProps) {
  const states = stageStates(events, finished)
  const stages = trackerStages(events)
  return (
    <Stack as="ol" listStyleType="none" gap="0" aria-label="Gate progress" aria-live="polite">
      {stages.map((stage, index) => {
        const state = states[stage.key]
        const StageIcon = stageIcon(stage.key)
        const message = stageMessage(events, stage.key)
        return (
          <HStack as="li" key={stage.key} gap="4" align="stretch">
            <Stack align="center" gap="0">
              <Circle size="10" flexShrink="0" borderWidth="1.5px" transition="background 300ms, border-color 300ms"
                bg={state === 'done' ? 'brand.solid' : state === 'current' ? 'accent.subtle' : 'bg.panel'}
                color={state === 'done' ? 'brand.contrast' : state === 'current' ? 'accent.fg' : 'fg.subtle'}
                borderColor={state === 'done' ? 'brand.solid' : state === 'current' ? 'accent.solid' : 'border.emphasized'}>
                {state === 'done' ? <Check size={18} strokeWidth={2.5} aria-hidden="true" /> : state === 'current' ? <Spinner size="sm" /> : <StageIcon size={17} aria-hidden="true" />}
              </Circle>
              {index < stages.length - 1 && <Box aria-hidden="true" w="2px" flex="1" minH="6" bg={state === 'done' ? 'brand.solid' : 'border'} transition="background 300ms" />}
            </Stack>
            <Stack gap="0.5" pb="6" pt="1.5" minW="0">
              <HStack gap="2">
                <Text fontWeight="semibold" color={state === 'waiting' ? 'fg.muted' : 'fg'}>{stage.label}</Text>
                <Text textStyle="xs" color="fg.subtle">{state === 'done' ? 'Done' : state === 'current' ? 'Working' : 'Waiting'}</Text>
              </HStack>
              <Text textStyle="sm" color="fg.muted">{state !== 'waiting' && message ? message : stage.says}</Text>
            </Stack>
          </HStack>
        )
      })}
    </Stack>
  )
}
