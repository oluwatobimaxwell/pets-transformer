import { useNavigate } from 'react-router-dom'
import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react'
import { HardDrive, RotateCcw } from 'lucide-react'
import { useDraft } from '../context/studio-context'
import { useStartOver } from '../hooks/use-start-over'
import { stepAnswers } from '../utils/step-answers'
import { STEP_WORDS } from '../utils/step-words'
import { WizardStepList } from './wizard-step-list'

/**
 * The wizard's side panel: the release being built, one step at a time with each answer under its step, and at the
 * foot a way to start over and the reminder that nothing leaves this machine.
 */
export function WizardPanel({ step }: { step: number }) {
  const { draft, reachable } = useDraft()
  const navigate = useNavigate()
  const startOver = useStartOver()

  return (
    <Stack as="nav" aria-label="Release progress" gap="0" h="full" minH="0" borderEndWidth="1px" borderColor="border" bg="bg.subtle">
      <Stack gap="5" flex="1" minH="0" overflowY="auto" px="4" pt="6" pb="4">
        <Stack gap="0.5" px="2.5">
          <Text textStyle="xs" fontWeight="semibold" color="fg.muted" letterSpacing="0.06em" textTransform="uppercase">Your release</Text>
          <Text textStyle="xs" color="fg.subtle">Each step keeps its answer. Pick a done step to change it.</Text>
        </Stack>
        <WizardStepList step={step} reachable={reachable} answers={stepAnswers(draft)} onStep={(index) => navigate(STEP_WORDS[index]!.path)} />
      </Stack>

      <Stack gap="3" px="4" py="4" borderTopWidth="1px" borderColor="border">
        {draft.dataset && step >= 0 && (
          <Button alignSelf="start" variant="ghost" size="sm" color="fg.muted" onClick={startOver}>
            <RotateCcw aria-hidden="true" />Start over
          </Button>
        )}
        <HStack gap="2.5" align="start" px="2.5" textStyle="xs" color="fg.muted">
          <Box pt="0.5" flexShrink="0" color="brand.fg"><HardDrive size={14} aria-hidden="true" /></Box>
          <Text>Runs on this machine. Your data, keys and row maps never leave it.</Text>
        </HStack>
      </Stack>
    </Stack>
  )
}
