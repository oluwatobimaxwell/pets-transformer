import { useState } from 'react'
import { Box, Button, Flex, HStack, Input, InputGroup, Stack, Table, Text } from '@chakra-ui/react'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import type { RecordTableOut } from '@/api/generated'
import { TechniqueChip } from '@/features/release'
import { queryRows, type RowQuery } from '../utils/record-rows'
import { techniqueKey } from '../utils/technique-key'
import { RecordCell } from './record-cell'

const PAGE_SIZE = 25

/** A released table's sampled rows: search them, sort by any column, follow a pseudonym to its other rows, a page at a time. */
export function RecordsTable({ table }: { table: RecordTableOut }) {
  const [rowQuery, setRowQuery] = useState<RowQuery>({ query: '', token: '', sort: -1, direction: 1 })
  const [page, setPage] = useState(0)
  const update = (next: Partial<RowQuery>) => { setRowQuery((current) => ({ ...current, ...next })); setPage(0) }
  const rows = queryRows(table.rows, rowQuery)
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(page, pages - 1)
  const slice = rows.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE)
  const sortBy = (index: number) => update({ sort: index, direction: rowQuery.sort === index ? (rowQuery.direction === 1 ? -1 : 1) : 1 })

  return (
    <Stack gap="3">
      <Flex gap="3" align={{ base: 'stretch', md: 'center' }} direction={{ base: 'column', md: 'row' }}>
        <InputGroup startElement={<Search size={15} aria-hidden="true" />} maxW={{ md: '80' }}>
          <Input size="sm" type="search" placeholder="Search these rows" aria-label="Search the released rows" value={rowQuery.query}
            onChange={(event) => update({ query: event.target.value })} bg="bg.panel" />
        </InputGroup>
        {rowQuery.token && (
          <HStack gap="1" ps="3" pe="1" py="0.5" rounded="full" bg="brand.subtle" color="brand.fg" textStyle="xs" alignSelf="start">
            Rows with <Text as="span" fontFamily="mono">{rowQuery.token}</Text>
            <Button size="2xs" variant="ghost" rounded="full" aria-label="Show every row again" onClick={() => update({ token: '' })}><X aria-hidden="true" /></Button>
          </HStack>
        )}
        <Text textStyle="xs" color="fg.muted" ms={{ md: 'auto' }}>
          {table.shown < table.total
            ? `A random sample of ${table.shown.toLocaleString('en-US')} of ${table.total.toLocaleString('en-US')} rows. The full table is in the download.`
            : `All ${table.total.toLocaleString('en-US')} rows.`}
        </Text>
      </Flex>
      <Table.ScrollArea borderWidth="1px" borderColor="border" rounded="l3" bg="bg.panel" maxH="70vh">
        <Table.Root size="sm" stickyHeader css={{ '& td, & th': { whiteSpace: 'nowrap' } }}>
          <Table.Header>
            <Table.Row bg="bg.subtle">
              {table.columns.map((column, index) => {
                const sorted = rowQuery.sort === index
                const SortIcon = rowQuery.direction === 1 ? ArrowUp : ArrowDown
                return (
                  <Table.ColumnHeader key={column.name} aria-sort={sorted ? (rowQuery.direction === 1 ? 'ascending' : 'descending') : 'none'} verticalAlign="top">
                    <Stack gap="1.5" align="start">
                      <Box asChild display="inline-flex" alignItems="center" gap="1" fontFamily="mono" fontWeight="semibold" color="fg" _hover={{ color: 'brand.fg' }}>
                        <button type="button" onClick={() => sortBy(index)}>
                          {column.name}
                          {sorted && <SortIcon size={12} aria-hidden="true" />}
                        </button>
                      </Box>
                      {column.technique && <TechniqueChip technique={techniqueKey(column.technique)} />}
                    </Stack>
                  </Table.ColumnHeader>
                )
              })}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {slice.length ? slice.map((row, rowIndex) => (
              <Table.Row key={current * PAGE_SIZE + rowIndex} bg="transparent" _hover={{ bg: 'bg.subtle' }}>
                {row.map((value, index) => (
                  <Table.Cell key={index} textStyle="sm" maxW="sm" overflow="hidden" textOverflow="ellipsis" title={typeof value === 'string' ? value : undefined}>
                    <RecordCell value={value} onToken={(token) => update({ token })} />
                  </Table.Cell>
                ))}
              </Table.Row>
            )) : (
              <Table.Row bg="transparent"><Table.Cell colSpan={table.columns.length} textAlign="center" py="10" color="fg.muted">No rows match.</Table.Cell></Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      <HStack justify="space-between" textStyle="xs" color="fg.muted">
        <Text fontVariantNumeric="tabular-nums">
          {rows.length ? `Rows ${(current * PAGE_SIZE + 1).toLocaleString('en-US')}–${Math.min(rows.length, (current + 1) * PAGE_SIZE).toLocaleString('en-US')} of ${rows.length.toLocaleString('en-US')}` : '0 rows'}
        </Text>
        <HStack gap="1">
          <Button size="xs" variant="outline" disabled={current === 0} onClick={() => setPage(current - 1)}><ChevronLeft aria-hidden="true" />Previous</Button>
          <Button size="xs" variant="outline" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>Next<ChevronRight aria-hidden="true" /></Button>
        </HStack>
      </HStack>
    </Stack>
  )
}
