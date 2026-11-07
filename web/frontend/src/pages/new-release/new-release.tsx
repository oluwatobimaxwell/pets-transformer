import { Box, Button, HStack, Stack } from '@chakra-ui/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/shared/components/page-header'
import { useScrollIntoView } from '@/shared/hooks/use-scroll-into-view'
import { ColumnsStep, DataStep, RecentRuns, RecipientStep, ReleaseSteps, RunStep, useReleaseDraft } from '@/features/release'

export default function NewReleasePage() {
  const api = useReleaseDraft()
  const { step, setStep, ready, reachable } = api
  const screens = [<DataStep onRegistered={api.chooseDataset} />, <RecipientStep api={api} />, <ColumnsStep api={api} />, <RunStep api={api} />]
  const last = screens.length - 1
  const stepsRef = useScrollIntoView<HTMLDivElement>(step)
  return (
    <Stack gap={{ base: '8', md: '10' }}>
      <PageHeader title="Protect a dataset" description="Upload data, say who receives it, check what was found, and let the gate decide what may be released." />
      <Stack gap="6">
        <Box ref={stepsRef} scrollMarginTop="20" borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" p={{ base: '2', md: '3' }}>
          <ReleaseSteps step={step} reachable={reachable} onStep={setStep} />
        </Box>
        <Box key={step} animation="rise 200ms var(--chakra-easings-out)">
          {screens[step]}
        </Box>
        {step > 0 && (
          <HStack gap="3" justify={step < last ? 'space-between' : 'start'} pt="2" borderTopWidth="1px" borderColor="border" paddingTop="5">
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
            {step < last && (
              <Button onClick={() => setStep(step + 1)} disabled={!ready[step]}>
                Continue
                <ArrowRight aria-hidden="true" />
              </Button>
            )}
          </HStack>
        )}
      </Stack>
      <RecentRuns />
    </Stack>
  )
}
