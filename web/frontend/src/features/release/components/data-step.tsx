import { Heading, Stack } from '@chakra-ui/react'
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
    <Stack gap="8">
      {errorMessage && <StatusAlert message={errorMessage} />}
      <Stack gap="3">
        <Heading size="md">Upload your data</Heading>
        <UploadBox onUpload={uploadFiles} disabled={isBusy} />
      </Stack>
      <Stack gap="3">
        <Heading size="md">Or use a challenge dataset</Heading>
        <SampleList onChoose={chooseSample} disabled={isBusy} />
      </Stack>
    </Stack>
  )
}
