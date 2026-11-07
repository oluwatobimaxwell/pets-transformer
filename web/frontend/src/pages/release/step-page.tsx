import type { ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Box, Button, Heading, HStack, Stack, Text, VisuallyHidden } from '@chakra-ui/react'
import { ArrowLeft, ArrowRight, CircleAlert } from 'lucide-react'
import { ReleaseSteps, STEP_TITLES, STEP_WORDS, useDraft, usePublishView, type StudioView } from '@/features/release'

interface StepPageProps {
  step: number
  title: string
  lead: ReactNode
  /** What the rail's 3D model shows on this page. */
  view: StudioView
  /** Why Continue is disabled, said next to it. */
  blockedBy?: string
  children: ReactNode
}

/**
 * One step of a release, as its own page. Every step answers the same four questions within seconds:
 * what this is (the title and lead), what to do (the content and one Continue), what the system is doing (the rail's
 * model and the busy pill) and what came out (the model and its figures).
 */
export function StepPage({ step, title, lead, view, blockedBy, children }: StepPageProps) {
  const { ready, reachable } = useDraft()
  const navigate = useNavigate()
  usePublishView(view)
  const next = STEP_WORDS[step + 1]
  const canContinue = Boolean(ready[step])

  return (
    <Stack gap={{ base: '6', md: '8' }}>
      <Box hideFrom="lg" borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" p="2">
        <ReleaseSteps step={step} reachable={reachable} onStep={(index) => navigate(STEP_WORDS[index]!.path)} />
      </Box>

      <Stack gap="3">
        <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" letterSpacing="display" lineHeight="1.1"
          display="flex" alignItems="baseline" gap="3.5">
          <Text as="span" fontFamily="mono" fontSize="md" fontWeight="medium" color="accent.fg" letterSpacing="0" aria-hidden="true">
            {String(step + 1).padStart(2, '0')}
          </Text>
          <span>
            <VisuallyHidden>Step {step + 1} of {STEP_TITLES.length}: </VisuallyHidden>
            {title}
          </span>
        </Heading>
        <Text color="fg.muted" textStyle={{ base: 'sm', md: 'md' }} maxW="70ch">{lead}</Text>
      </Stack>

      <Box className="stagger">{children}</Box>

      {(step > 0 || (next && canContinue)) && (
        <HStack gap="3" justify="space-between" position="sticky" bottom="0" zIndex="docked" mx={{ base: '-4', md: '-8' }} px={{ base: '4', md: '8' }} py="3"
          bg="bg" borderTopWidth="1px" borderColor="border" boxShadow="panel">
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
            <Button onClick={() => navigate(next.path)} disabled={!canContinue || step + 1 > reachable}>
              Continue to {STEP_TITLES[step + 1]!.toLowerCase()}
              <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </HStack>
      )}
    </Stack>
  )
}

/** A step page opens only once the steps before it are answered; otherwise it sends the person to the first open one. */
export function RequireStep({ step, children }: { step: number; children: ReactNode }) {
  const { reachable } = useDraft()
  if (step > reachable) return <Navigate to={STEP_WORDS[reachable]!.path} replace />
  return <>{children}</>
}
