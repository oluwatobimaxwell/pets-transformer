import { useState } from 'react'
import { Flex, Input, InputGroup, Stack } from '@chakra-ui/react'
import { Columns3, Search } from 'lucide-react'
import type { EvidenceOut } from '@/api/generated'
import { FIELD_FILTERS, fieldCounts, filterFields, type FieldFilter } from '../utils/field-filters'
import { EvidenceEmpty } from './evidence-empty'
import { FieldsTable } from './fields-table'
import { FilterPills } from './filter-pills'
import { TuningSummary } from './tuning-summary'

/** What happened to every column, opening on the ones that leave; anything no required question uses is removed. */
export function ColumnsPanel({ evidence }: { evidence: EvidenceOut }) {
  const [filter, setFilter] = useState<FieldFilter>('kept')
  const [query, setQuery] = useState('')
  const { fields } = evidence
  if (!fields.length) {
    return <EvidenceEmpty icon={Columns3} title="No columns were planned" text={evidence.answers ? 'A public release publishes answers, not columns. Its questions and their noise are on the Overview tab.' : 'The gate stopped this run before Select chose a technique for any column.'} />
  }
  const counts = fieldCounts(fields)
  return (
    <Stack gap="4">
      <TuningSummary tuning={evidence.tuning} recoding={evidence.recoding} />
      <Flex gap="3" justify="space-between" align={{ base: 'stretch', md: 'center' }} direction={{ base: 'column', md: 'row' }}>
        <FilterPills label="Show columns" value={filter} onChange={setFilter} options={FIELD_FILTERS.map((option) => ({ ...option, count: counts[option.value] }))} />
        <InputGroup startElement={<Search size={15} aria-hidden="true" />} maxW={{ md: '72' }}>
          <Input size="sm" type="search" placeholder="Search columns" aria-label="Search columns" value={query} onChange={(event) => setQuery(event.target.value)} bg="bg.panel" />
        </InputGroup>
      </Flex>
      <FieldsTable fields={filterFields(fields, filter, query)} />
    </Stack>
  )
}
