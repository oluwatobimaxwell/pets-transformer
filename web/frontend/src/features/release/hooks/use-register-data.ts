import { registerSampleMutation, uploadDatasetMutation } from '@/api/generated/@tanstack/react-query.gen'
import type { DatasetOut } from '@/api/generated'
import { useApiMutation } from '@/shared/hooks/use-api-mutation'

/** Registers data for a release: an upload of CSV files, or one of the challenge samples. */
export function useRegisterData(onRegistered: (dataset: DatasetOut) => void) {
  const upload = useApiMutation({ ...uploadDatasetMutation(), onSuccess: onRegistered })
  const sample = useApiMutation({ ...registerSampleMutation(), onSuccess: onRegistered })
  return {
    uploadFiles: (files: File[]) => upload.mutate({ body: { files } }),
    chooseSample: (name: string) => sample.mutate({ body: { name } }),
    isBusy: upload.isPending || sample.isPending,
    errorMessage: upload.errorMessage ?? sample.errorMessage,
  }
}
