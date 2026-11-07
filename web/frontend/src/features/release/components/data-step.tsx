import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HStack, Stack } from '@chakra-ui/react'
import type { DatasetOut } from '@/api/generated'
import { listSamplesOptions } from '@/api/generated/@tanstack/react-query.gen'
import { CubeSpinner } from '@/shared/components/motion/cube-spinner'
import { StatusAlert } from '@/shared/components/status-alert'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { useRegisterData } from '../hooks/use-register-data'
import { DATA_SOURCES, type DataSource } from '../utils/data-sources'
import { ChoiceCards } from './choice-cards'
import { SampleTable } from './sample-table'
import { UploadBox } from './upload-box'

interface DataStepProps {
  onRegistered: (dataset: DatasetOut) => void
  /** The dataset the release already uses, marked in the list. */
  chosen?: string
}

/**
 * Choose where the data comes from, then pick a challenge dataset or upload CSV files.
 * `?sample=health` (from the landing page) picks that sample straight away.
 */
export function DataStep({ onRegistered, chosen }: DataStepProps) {
  const { uploadFiles, chooseSample, isBusy, errorMessage } = useRegisterData(onRegistered)
  const [params, setParams] = useSearchParams()
  const wanted = params.get('sample')
  const { data: samples } = useApiQuery(listSamplesOptions())
  const autoloaded = useRef(false)
  const [source, setSource] = useState<DataSource>('sample')

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
      <ChoiceCards options={DATA_SOURCES} value={source} onChange={setSource} label="Where the data comes from" />
      <div key={source} className="stagger">
        {source === 'sample'
          ? <SampleTable onChoose={chooseSample} disabled={isBusy} chosen={chosen} onUploadInstead={() => setSource('upload')} />
          : <UploadBox onUpload={uploadFiles} disabled={isBusy} />}
      </div>
    </Stack>
  )
}
