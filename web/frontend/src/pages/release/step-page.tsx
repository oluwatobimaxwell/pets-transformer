import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { ArrowLeft, ArrowRight, CircleAlert } from 'lucide-react'
import { STEP_TITLES, STEP_WORDS, useDraft, WizardHelp } from '@/features/release'

interface StepPageProps {
  step: number
  title: string
  lead: ReactNode
  /** Why Continue is disabled, said next to it. */
  blockedBy?: string
  children: ReactNode
}

/**
 * One step of the wizard. It says which step this is and what it asks, explains why it matters beside the content,
 * and keeps Back and Continue in one bar at the bottom of the screen, with the reason when Continue has to wait.
 */
export function StepPage({ step, title, lead, blockedBy, children }: StepPageProps) {
  const { ready, reachable } = useDraft()
  const navigate = useNavigate()
  const next = STEP_WORDS[step + 1]
  const canContinue = Boolean(ready[step])

  return (
    <Stack gap="0" minH="full">
      <Box flex="1" px={{ base: '4', md: '8', xl: '12' }} py={{ base: '6', md: '10' }}>
        <Stack gap={{ base: '6', md: '8' }} maxW="7xl" mx="auto" className="stagger">
          <Stack gap="3" maxW="3xl">
            <Text textStyle="sm" fontWeight="semibold" color="accent.fg" fontVariantNumeric="tabular-nums">Step {step + 1} of {STEP_TITLES.length}</Text>
            <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" letterSpacing="-0.025em" lineHeight="1.1">{title}</Heading>
            <Text color="fg.muted" textStyle={{ base: 'md', md: 'lg' }} lineHeight="1.6">{lead}</Text>
          </Stack>
          <Grid templateColumns={{ base: 'minmax(0, 1fr)', '2xl': 'minmax(0, 1fr) 320px' }} gap={{ base: '6', '2xl': '8' }} alignItems="start">
            <Box minW="0">{children}</Box>
            <Box position={{ '2xl': 'sticky' }} top="6"><WizardHelp step={step} /></Box>
          </Grid>
        </Stack>
      </Box>

      <HStack gap="3" justify="space-between" position="sticky" bottom="0" zIndex="docked" px={{ base: '4', md: '8', xl: '12' }} py="3.5"
        bg="bg" borderTopWidth="1px" borderColor="border">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => navigate(STEP_WORDS[step - 1]!.path)}>
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>
        ) : <span />}
        <Text flex="1" textAlign="center" textStyle="sm" color="accent.fg" fontWeight="medium" aria-live="polite" hideBelow="sm">
          {next && !canContinue && blockedBy && (
            <HStack as="span" display="inline-flex" gap="1.5"><CircleAlert size={15} aria-hidden="true" />{blockedBy}</HStack>
          )}
        </Text>
        {next && (
          <Button size="lg" onClick={() => navigate(next.path)} disabled={!canContinue || step + 1 > reachable}>
            Continue to {STEP_TITLES[step + 1]!.toLowerCase()}
            <ArrowRight aria-hidden="true" />
          </Button>
        )}
      </HStack>
    </Stack>
  )
}
