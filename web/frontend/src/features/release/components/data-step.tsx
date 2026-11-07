import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import type { DatasetOut } from '@/api/generated'
import { listSamplesOptions } from '@/api/generated/@tanstack/react-query.gen'
import { CubeSpinner } from '@/shared/components/motion/cube-spinner'
import { StatusAlert } from '@/shared/components/status-alert'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { useRegisterData } from '../hooks/use-register-data'
import { SampleList } from './sample-list'
import { UploadBox } from './upload-box'

interface DataStepProps {
  onRegistered: (dataset: DatasetOut) => void
}

/** Upload CSV files or pick a challenge dataset. `?sample=health` (from the landing page) picks that sample straight away. */
export function DataStep({ onRegistered }: DataStepProps) {
  const { uploadFiles, chooseSample, isBusy, errorMessage } = useRegisterData(onRegistered)
  const [params, setParams] = useSearchParams()
  const wanted = params.get('sample')
  const { data: samples } = useApiQuery(listSamplesOptions())
  const autoloaded = useRef(false)

  useEffect(() => {
    if (!wanted || !samples || autoloaded.current) return
    autoloaded.current = true
    setParams({}, { replace: true })
    if (samples.some((sample) => sample.name === wanted)) chooseSample(wanted)
  }, [wanted, samples, chooseSample, setParams])

  return (
    <Stack gap="6">
      {errorMessage && <StatusAlert message={errorMessage} />}
      {isBusy && (
        <HStack role="status" gap="2.5" alignSelf="start" colorPalette="brand" bg="colorPalette.subtle" color="colorPalette.fg"
          borderWidth="1px" borderColor="colorPalette.border" rounded="full" px="3" py="1.5" textStyle="sm" fontFamily="mono">
          <CubeSpinner />
          Registering the data and reading its tables…
        </HStack>
      )}
      <Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 5fr) minmax(0, 8fr)' }} gap={{ base: '8', lg: '6' }} alignItems="start">
        <Stack gap="3">
          <Heading as="h2" textStyle="md">Upload your data</Heading>
          <UploadBox onUpload={uploadFiles} disabled={isBusy} />
        </Stack>
        <Stack gap="3">
          <Stack gap="0.5">
            <Heading as="h2" textStyle="md">Or use a challenge dataset</Heading>
            <Text textStyle="sm" color="fg.muted">Synthetic data from the challenge package, ready to protect.</Text>
          </Stack>
          <SampleList onChoose={chooseSample} disabled={isBusy} />
        </Stack>
      </Grid>
    </Stack>
  )
}
