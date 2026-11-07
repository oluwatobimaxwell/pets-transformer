import { getEvidenceOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'

/** A finished run's evidence. Asked for only once the gate has decided, since there is none before. */
export function useEvidence(runId: string, decided: boolean) {
  return useApiQuery({ ...getEvidenceOptions({ path: { run_id: runId } }), enabled: decided, staleTime: Infinity })
}
