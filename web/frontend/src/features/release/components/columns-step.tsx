import { HStack, Skeleton, Stack, Table, Text } from '@chakra-ui/react'
import { getColumnsOptions, getTechniqueRulesOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { StatusAlert } from '@/shared/components/status-alert'
import type { ReleaseDraftApi } from '../hooks/use-release-draft'
import { roleCounts } from '../utils/role-counts'
import { unsureFirst } from '../utils/sort-columns'
import { techniqueCounts } from '../utils/technique-counts'
import { techniqueFor } from '../utils/technique-for'
import { ColumnRow } from './column-row'
import { RoleBadge } from './role-badge'
import { TechniqueChip } from './technique-chip'

interface ColumnsStepProps {
  api: ReleaseDraftApi
}

/** One row after another, so the picking reads as the gate working down the table. */
const PICK_STEP_MS = 70
const PICK_START_MS = 300

/** What Detect found in every column and the technique each would get. Unsure columns come first, for a person to confirm or correct. */
export function ColumnsStep({ api }: ColumnsStepProps) {
  const { draft, decide } = api
  const { data, isLoading, errorMessage } = useApiQuery(getColumnsOptions({ path: { dataset_id: draft.dataset!.id } }))
  const { data: rules } = useApiQuery(getTechniqueRulesOptions())
  if (isLoading) {
    return (
      <Stack gap="4" aria-busy="true">
        <Text color="fg.muted">Detect is reading every column. Large datasets take up to a minute.</Text>
        <Skeleton h="14" rounded="l3" />
        <Stack gap="2">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} h="12" rounded="l2" />)}</Stack>
      </Stack>
    )
  }
  if (errorMessage) return <StatusAlert message={errorMessage} />
  const columns = [...(data ?? [])].sort(unsureFirst)
  const unsure = columns.filter((column) => column.needs_review && !draft.decisions[column.key]).length
  const techniques = columns.map((column) => {
    const decision = draft.decisions[column.key]
    return techniqueFor(rules, decision?.role ?? column.role, decision?.subtype ?? column.subtype)
  })
  return (
    <Stack gap="5">
      <Stack gap="2.5" borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" p="4">
        <Text textStyle="sm" color="fg.muted">
          Detect read <Text as="span" fontWeight="semibold" color="fg">{columns.length} columns</Text> from their values and names:
        </Text>
        <HStack gap="2" flexWrap="wrap">
          {roleCounts(columns, draft.decisions).map(({ role, count }) => (
            <HStack key={role} gap="1.5">
              <Text fontWeight="semibold" fontVariantNumeric="tabular-nums" textStyle="sm">{count}</Text>
              <RoleBadge role={role} />
            </HStack>
          ))}
        </HStack>
        {rules && (
          <>
            <Text textStyle="sm" color="fg.muted" pt="2">
              From the engine's rules, the technique each would get if the recipient's questions need it. The rest are removed.
            </Text>
            <HStack gap="2" flexWrap="wrap">
              {techniqueCounts(techniques).map(({ technique, count }) => (
                <HStack key={technique} gap="1.5">
                  <Text fontWeight="semibold" fontVariantNumeric="tabular-nums" textStyle="sm">{count}</Text>
                  <TechniqueChip technique={technique} />
                </HStack>
              ))}
            </HStack>
          </>
        )}
      </Stack>
      {unsure > 0 ? (
        <StatusAlert status="warning" title={`${unsure} unsure ${unsure === 1 ? 'column' : 'columns'}`}
          message="These count as private facts until you confirm or correct them. If a question needs one, the gate will hold the release for review." />
      ) : (
        <StatusAlert status="success" message="Every column is either confidently detected or decided by you." />
      )}
      <Text textStyle="sm" color="fg.muted">Columns no question needs are removed whatever they are, so you only need to check the ones that matter.</Text>
      <Table.ScrollArea borderWidth="1px" borderColor="border" rounded="l3" maxH="70vh" bg="bg.panel">
        <Table.Root size="sm" stickyHeader>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Column</Table.ColumnHeader>
              <Table.ColumnHeader>Detect found</Table.ColumnHeader>
              <Table.ColumnHeader>Your decision</Table.ColumnHeader>
              <Table.ColumnHeader>Technique</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {columns.map((column, index) => (
              <ColumnRow key={column.key} column={column} decision={draft.decisions[column.key]} technique={techniques[index]}
                pickDelayMs={PICK_START_MS + index * PICK_STEP_MS} onDecide={(role, subtype) => decide(column, role, subtype)} />
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Stack>
  )
}
