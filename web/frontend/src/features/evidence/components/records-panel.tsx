import { useState } from 'react'
import { HStack, Skeleton, Stack, Text } from '@chakra-ui/react'
import { CircleAlert, Rows3 } from 'lucide-react'
import type { RecordsIndexOut } from '@/api/generated'
import { StatusAlert } from '@/shared/components/status-alert'
import { useRecordTable } from '../hooks/use-record-table'
import { EvidenceEmpty } from './evidence-empty'
import { FilterPills } from './filter-pills'
import { RecordsTable } from './records-table'

interface RecordsPanelProps {
  runId: string
  records: RecordsIndexOut
}

/** The rows the recipient receives, one table at a time. Held rows are staged, not released, and say so. */
export function RecordsPanel({ runId, records }: RecordsPanelProps) {
  const [table, setTable] = useState(records.tables[0])
  const { data, isLoading, errorMessage } = useRecordTable(runId, table)
  if (records.status === 'none' || !records.tables.length || !table) {
    return <EvidenceEmpty icon={Rows3} title="Nothing was released" text="The gate stopped this run, so there are no protected rows to show." />
  }
  return (
    <Stack gap="4">
      {records.status === 'held' && (
        <HStack gap="2.5" colorPalette="orange" bg="colorPalette.subtle" color="colorPalette.fg" borderWidth="1px" borderColor="colorPalette.muted" rounded="l2" p="3" textStyle="sm">
          <CircleAlert size={16} aria-hidden="true" />
          Held for review. These rows are staged and have not been released.
        </HStack>
      )}
      <Text textStyle="sm" color="fg.muted" maxW="75ch">
        These are the rows the recipient receives. Underlined codes are keyed pseudonyms: select one to see every row for the same
        person or record. Highlighted labels mark redacted text.
      </Text>
      {records.tables.length > 1 && (
        <FilterPills label="Choose a table" value={table} onChange={setTable} options={records.tables.map((name) => ({ value: name, label: name }))} />
      )}
      {errorMessage ? <StatusAlert message={errorMessage} /> : isLoading || !data ? (
        <Stack gap="2" aria-busy="true" aria-label="Loading the rows"><Skeleton h="9" w="80" rounded="l2" /><Skeleton h="96" rounded="l3" /></Stack>
      ) : <RecordsTable key={data.name} table={data} />}
    </Stack>
  )
}
