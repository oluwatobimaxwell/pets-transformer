import { Button, HStack, Separator, Stack } from '@chakra-ui/react'
import { PageHeader } from '@/shared/components/page-header'
import { ColumnsStep, DataStep, RecentRuns, RecipientStep, ReleaseSteps, RunStep, useReleaseDraft } from '@/features/release'

export default function NewReleasePage() {
  const api = useReleaseDraft()
  const { step, setStep, ready, reachable } = api
  const screens = [<DataStep onRegistered={api.chooseDataset} />, <RecipientStep api={api} />, <ColumnsStep api={api} />, <RunStep api={api} />]
  return (
    <Stack gap="8">
      <PageHeader title="Protect a dataset" description="Upload data, say who receives it, check what was found, and let the gate decide what may be released." />
      <ReleaseSteps step={step} reachable={reachable} onStep={setStep} />
      <Separator />
      {screens[step]}
      {step > 0 && step < screens.length - 1 && (
        <HStack gap="3">
          <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
          <Button onClick={() => setStep(step + 1)} disabled={!ready[step]}>Continue</Button>
        </HStack>
      )}
      {step === screens.length - 1 && <Button alignSelf="start" variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
      <Separator />
      <RecentRuns />
    </Stack>
  )
}
