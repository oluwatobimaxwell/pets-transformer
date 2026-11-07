import { Badge, HStack, Text } from '@chakra-ui/react'
import { STEP_TITLES } from '../types'

interface ReleaseStepsProps {
  step: number
  reachable: number
  onStep: (step: number) => void
}

/** Where the person is in the flow. Earlier steps stay clickable. */
export function ReleaseSteps({ step, reachable, onStep }: ReleaseStepsProps) {
  return (
    <HStack as="ol" gap="2" flexWrap="wrap" listStyleType="none" aria-label="Release steps">
      {STEP_TITLES.map((title, index) => (
        <HStack as="li" key={title} gap="2">
          <Badge
            asChild
            size="lg"
            variant={index === step ? 'solid' : 'subtle'}
            colorPalette={index < step ? 'green' : 'gray'}
            cursor={index <= reachable ? 'pointer' : 'default'}
          >
            <button type="button" disabled={index > reachable} onClick={() => onStep(index)} aria-current={index === step ? 'step' : undefined}>
              {index + 1}. {title}
            </button>
          </Badge>
          {index < STEP_TITLES.length - 1 && <Text color="fg.subtle" aria-hidden>→</Text>}
        </HStack>
      ))}
    </HStack>
  )
}
