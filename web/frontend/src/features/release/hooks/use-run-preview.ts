import { useEffect } from 'react'
import { getPreviewOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'

const POLL_MS = 1500

/** A few rows of a run before and after the gate, re-read while it works and once more when it decides. */
export function useRunPreview(runId: string, finished: boolean) {
  const query = useApiQuery({ ...getPreviewOptions({ path: { run_id: runId } }), refetchInterval: finished ? false : POLL_MS })
  const { refetch } = query
  useEffect(() => {
    if (finished) void refetch()
  }, [finished, refetch])
  return query
}
