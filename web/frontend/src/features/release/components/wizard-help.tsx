import { HStack, Stack, Text } from '@chakra-ui/react'
import { Check, Lightbulb } from 'lucide-react'
import { WIZARD_HELP } from '../utils/wizard-help'

/** Why a step matters and what to know before answering it, beside the step's own content. */
export function WizardHelp({ step }: { step: number }) {
  const help = WIZARD_HELP[step]
  if (!help) return null
  return (
    <Stack as="aside" aria-label="Good to know" gap="4" p="5" rounded="l3" borderWidth="1px" borderColor="border" bg="bg.panel">
      <HStack gap="2" color="accent.fg" fontWeight="semibold" textStyle="sm">
        <Lightbulb size={16} aria-hidden="true" />Good to know
      </HStack>
      <Text textStyle="sm" color="fg">{help.why}</Text>
      <Stack as="ul" listStyleType="none" gap="2.5">
        {help.tips.map((tip) => (
          <HStack as="li" key={tip} gap="2.5" align="start" textStyle="sm" color="fg.muted">
            <Check size={15} aria-hidden="true" style={{ flexShrink: 0, marginTop: 3, color: 'var(--chakra-colors-brand-fg)' }} />
            {tip}
          </HStack>
        ))}
      </Stack>
    </Stack>
  )
}
