import { Table, Text } from '@chakra-ui/react'
import type { ComparisonRowOut } from '@/api/generated'
import { formatMeasure } from '../utils/share-format'

/** The question's answers on the original and on the protected data, row by row, with the protected value marked where it moved. */
export function ComparisonTable({ rows }: { rows: ComparisonRowOut[] }) {
  return (
    <Table.ScrollArea borderWidth="1px" borderColor="border.muted" rounded="l2" maxH="72">
      <Table.Root size="sm" stickyHeader>
        <Table.Header>
          <Table.Row bg="bg.subtle">
            <Table.ColumnHeader>Answer for</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Original</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Protected</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => {
            const moved = row.before !== row.after
            return (
              <Table.Row key={row.label} bg="transparent">
                <Table.Cell><Text textStyle="xs" fontFamily="mono" color="fg.muted">{row.label}</Text></Table.Cell>
                <Table.Cell textAlign="end" fontFamily="mono" textStyle="xs">{formatMeasure(row.before)}</Table.Cell>
                <Table.Cell textAlign="end" fontFamily="mono" textStyle="xs" color={moved ? 'orange.fg' : 'fg'}>
                  {formatMeasure(row.after)}
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}
