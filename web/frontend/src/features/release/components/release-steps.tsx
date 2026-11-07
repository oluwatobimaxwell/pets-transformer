import { Box, Circle, Flex, Stack, Text } from '@chakra-ui/react'
import { Check } from 'lucide-react'
import { STEP_TITLES } from '../types'
import { STEP_WORDS } from '../utils/step-words'

interface ReleaseStepsProps {
  step: number
  reachable: number
  onStep: (step: number) => void
}

/** Where the person is in the flow. Done and reachable steps stay clickable; later ones wait until the current one is answered. */
export function ReleaseSteps({ step, reachable, onStep }: ReleaseStepsProps) {
  return (
    <Flex as="ol" listStyleType="none" aria-label="Release steps" gap={{ base: '1', md: '0' }}>
      {STEP_TITLES.map((title, index) => {
        const { icon: StepIcon, hint } = STEP_WORDS[index]!
        const done = index < step
        const current = index === step
        const open = index <= reachable
        return (
          <Flex as="li" key={title} flex="1" align="center" minW="0">
            <Box asChild flex="1" minW="0" textAlign="start" rounded="l2" px={{ base: '1', md: '2' }} py="2"
              cursor={open ? 'pointer' : 'not-allowed'} opacity={open ? 1 : 0.55}
              _hover={open && !current ? { bg: 'bg.muted' } : undefined} transition="background 180ms">
              <button type="button" disabled={!open} onClick={() => onStep(index)} aria-current={current ? 'step' : undefined}
                aria-label={`Step ${index + 1} of ${STEP_TITLES.length}: ${title}${done ? ', done' : ''}`}>
                <Flex align="center" gap="3" direction={{ base: 'column', md: 'row' }}>
                  <Circle size="9" flexShrink="0" borderWidth="1px"
                    bg={current ? 'accent.solid' : done ? 'brand.solid' : 'bg.raised'}
                    color={current ? 'accent.contrast' : done ? 'brand.contrast' : 'fg.muted'}
                    borderColor={current ? 'accent.edge' : done ? 'brand.solid' : 'border.emphasized'}
                    boxShadow={current ? '0 3px 0 {colors.accent.edge}' : done ? '0 2px 0 {colors.brand.edge}' : '0 2px 0 {colors.border.emphasized}'}
                    transition="background 250ms, box-shadow 250ms">
                    {done ? <Check size={16} strokeWidth={2.5} /> : <StepIcon size={16} />}
                  </Circle>
                  <Stack gap="0" minW="0" align={{ base: 'center', md: 'start' }}>
                    <Text textStyle="xs" color="fg.muted" fontVariantNumeric="tabular-nums" hideBelow="md">Step {index + 1}</Text>
                    <Text textStyle="sm" fontWeight={current ? 'semibold' : 'medium'} color={current ? 'fg' : 'fg.muted'} truncate>{title}</Text>
                    <Text textStyle="xs" color="fg.subtle" truncate hideBelow="lg">{hint}</Text>
                  </Stack>
                </Flex>
              </button>
            </Box>
            {index < STEP_TITLES.length - 1 && (
              <Box aria-hidden="true" h="2px" w={{ base: '3', md: '8' }} flexShrink="0" rounded="full" mx="1"
                bg={done ? 'brand.solid' : 'border.emphasized'} transition="background 180ms" hideBelow="sm" />
            )}
          </Flex>
        )
      })}
    </Flex>
  )
}
