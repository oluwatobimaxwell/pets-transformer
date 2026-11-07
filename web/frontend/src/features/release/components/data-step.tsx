import { Grid, Heading, Stack, Text } from '@chakra-ui/react'
import type { DatasetOut } from '@/api/generated'
import { StatusAlert } from '@/shared/components/status-alert'
import { useRegisterData } from '../hooks/use-register-data'
import { SampleList } from './sample-list'
import { UploadBox } from './upload-box'

interface DataStepProps {
  onRegistered: (dataset: DatasetOut) => void
}

export function DataStep({ onRegistered }: DataStepProps) {
  const { uploadFiles, chooseSample, isBusy, errorMessage } = useRegisterData(onRegistered)
  return (
    <Stack gap="6">
      {errorMessage && <StatusAlert message={errorMessage} />}
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
