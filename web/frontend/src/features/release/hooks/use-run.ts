import { getRunOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { statusWord } from '../utils/status-words'

const POLL_MS = 1000

/** A run, re-read every second until the gate has decided. */
export function useRun(runId: string) {
  return useApiQuery({
    ...getRunOptions({ path: { run_id: runId } }),
    refetchInterval: (query) => (query.state.data && statusWord(query.state.data.status).finished ? false : POLL_MS),
  })
}
