import { Stack, Table, Text } from '@chakra-ui/react'
import { getColumnsOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { StatusAlert } from '@/shared/components/status-alert'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import type { ReleaseDraftApi } from '../hooks/use-release-draft'
import { unsureFirst } from '../utils/sort-columns'
import { ColumnRow } from './column-row'

interface ColumnsStepProps {
  api: ReleaseDraftApi
}

/** What Detect found in every column. Unsure columns come first, for a person to confirm or correct. */
export function ColumnsStep({ api }: ColumnsStepProps) {
  const { draft, decide } = api
  const { data, isLoading, errorMessage } = useApiQuery(getColumnsOptions({ path: { dataset_id: draft.dataset!.id } }))
  if (isLoading) {
    return (
      <Stack gap="3" align="start">
        <LoadingSpinner />
        <Text color="fg.muted">Detect is reading every column. Large datasets take up to a minute.</Text>
      </Stack>
    )
  }
  if (errorMessage) return <StatusAlert message={errorMessage} />
  const columns = [...(data ?? [])].sort(unsureFirst)
  const unsure = columns.filter((column) => column.needs_review && !draft.decisions[column.key]).length
  return (
    <Stack gap="4">
      {unsure > 0 ? (
        <StatusAlert status="warning" title={`${unsure} unsure ${unsure === 1 ? 'column' : 'columns'}`}
          message="These count as private facts until you confirm or correct them. If a question needs one, the gate will hold the release for review." />
      ) : (
        <StatusAlert status="success" message="Every column is either confidently detected or decided by you." />
      )}
      <Text color="fg.muted">Columns no question needs are removed whatever they are, so you only need to check the ones that matter.</Text>
      <Table.ScrollArea borderWidth="1px" rounded="l2" maxH="70vh">
        <Table.Root size="sm" stickyHeader>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Column</Table.ColumnHeader>
              <Table.ColumnHeader>Detect found</Table.ColumnHeader>
              <Table.ColumnHeader>Your decision</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {columns.map((column) => (
              <ColumnRow key={column.key} column={column} decision={draft.decisions[column.key]}
                onDecide={(role, subtype) => decide(column, role, subtype)} />
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Stack>
  )
}
