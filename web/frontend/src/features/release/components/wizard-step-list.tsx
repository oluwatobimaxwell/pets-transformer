import { Box, Circle, Stack, Text } from '@chakra-ui/react'
import { Check, Lock } from 'lucide-react'
import { STEP_TITLES } from '../types'
import type { StepAnswer } from '../utils/step-answers'
import { STEP_WORDS } from '../utils/step-words'

interface WizardStepListProps {
  /** The step on screen, or -1 once the gate is running and every step is behind the person. */
  step: number
  reachable: number
  /** What the person answered at each step, from stepAnswers. */
  answers: (StepAnswer | null)[]
  onStep: (step: number) => void
}

/**
 * The four steps down the wizard's side, each carrying its answer once it has one, so the release being built reads
 * top to bottom. Done steps are ticked and clickable, the current one sits raised in mandarin, later ones say what
 * opens them.
 */
export function WizardStepList({ step, reachable, answers, onStep }: WizardStepListProps) {
  const running = step < 0
  const last = STEP_TITLES.length - 1
  return (
    <Stack as="ol" listStyleType="none" gap="0" aria-label="Release steps">
      {STEP_TITLES.map((title, index) => {
        const { icon: StepIcon, hint } = STEP_WORDS[index]!
        const done = running || index < step
        const current = index === step
        const open = !running && index <= reachable
        const answer = open || done ? answers[index] : null
        const note = answer?.text ?? (open || done || index === 0 ? hint : `Opens after ${STEP_TITLES[index - 1]}`)
        return (
          <Box as="li" key={title} position="relative" pb={index < last ? '2' : '0'}>
            {index < last && (
              <Box aria-hidden="true" position="absolute" left="28px" top="12" bottom="-2.5" w="2px" rounded="full"
                bg={done ? 'brand.solid' : 'border'} transition="background 300ms" />
            )}
            <Box asChild position="relative" zIndex="1" display="flex" gap="3" alignItems="start" w="full" textAlign="start" rounded="l3" p="2.5" borderWidth="1px"
              bg={current ? 'bg.panel' : 'transparent'} borderColor={current ? 'border' : 'transparent'} boxShadow={current ? 'xs' : undefined}
              cursor={open && !current ? 'pointer' : 'default'} _hover={open && !current ? { bg: 'bg.muted' } : undefined}
              transition="background 180ms, border-color 180ms, box-shadow 180ms">
              <button type="button" disabled={!open || current} onClick={() => onStep(index)} aria-current={current ? 'step' : undefined}
                aria-label={`Step ${index + 1} of ${STEP_TITLES.length}: ${title}${done ? ', done' : ''}. ${note}`}>
                <Circle size="9" flexShrink="0" borderWidth="1.5px" borderStyle={open || done ? 'solid' : 'dashed'}
                  bg={current ? 'accent.solid' : done ? 'brand.solid' : 'bg.panel'}
                  color={current ? 'accent.contrast' : done ? 'brand.contrast' : open ? 'fg.muted' : 'fg.subtle'}
                  borderColor={current ? 'accent.solid' : done ? 'brand.solid' : 'border.emphasized'}
                  boxShadow={current ? '0 0 0 4px var(--chakra-colors-accent-subtle)' : undefined}
                  transition="background 300ms, border-color 300ms, box-shadow 300ms">
                  {done ? <Check size={16} strokeWidth={2.5} /> : open ? <StepIcon size={16} /> : <Lock size={14} />}
                </Circle>
                <Stack gap="0.5" pt="0.5" minW="0" flex="1">
                  <Text textStyle="xs" fontWeight="medium" color={current ? 'accent.fg' : 'fg.subtle'} fontVariantNumeric="tabular-nums">
                    Step {index + 1}{current ? ' · now' : ''}
                  </Text>
                  <Text textStyle="sm" fontWeight="semibold" color={open || done ? 'fg' : 'fg.muted'}>{title}</Text>
                  <Text textStyle="xs" truncate title={note} color={answer ? 'fg' : 'fg.muted'} fontFamily={answer?.mono ? 'mono' : undefined}>
                    {note}
                  </Text>
                </Stack>
              </button>
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}
