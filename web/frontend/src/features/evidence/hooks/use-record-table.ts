import { getRecordsOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'

/** A sample of one released table's rows, read when its tab is opened. A finished run's rows never change. */
export function useRecordTable(runId: string, table: string | undefined) {
  return useApiQuery({ ...getRecordsOptions({ path: { run_id: runId, table: table ?? '' } }), enabled: Boolean(table), staleTime: Infinity })
}
