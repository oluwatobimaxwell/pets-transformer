import { Box, Circle, Flex, Stack, Text } from '@chakra-ui/react'
import { GATE_STAGES, stageIcon, stagePalette } from '../utils/stage-words'

/** The five things the gate does, in order, so the person knows what "run" means before pressing it. */
export function GateStages() {
  return (
    <Flex as="ol" listStyleType="none" aria-label="What the gate does" direction={{ base: 'column', md: 'row' }} gap={{ base: '3', md: '0' }} className="stagger">
      {GATE_STAGES.map((stage, index) => {
        const StageIcon = stageIcon(stage.key)
        return (
          <Flex as="li" key={stage.key} flex="1" align={{ base: 'center', md: 'start' }} direction={{ base: 'row', md: 'column' }} gap="2.5" position="relative">
            <Flex align="center" w={{ md: 'full' }}>
              <Circle size="9" colorPalette={stagePalette(stage.key)} bg="colorPalette.subtle" borderWidth="1px" borderColor="colorPalette.muted"
                color="colorPalette.fg" flexShrink="0">
                <StageIcon size={16} aria-hidden="true" />
              </Circle>
              {index < GATE_STAGES.length - 1 && <Box aria-hidden="true" flex="1" h="1px" bg="border.emphasized" mx="2" hideBelow="md" />}
            </Flex>
            <Stack gap="0" pe="3">
              <Text textStyle="sm" fontWeight="semibold">{stage.label}</Text>
              <Text textStyle="xs" color="fg.muted">{stage.says}</Text>
            </Stack>
          </Flex>
        )
      })}
    </Flex>
  )
}
