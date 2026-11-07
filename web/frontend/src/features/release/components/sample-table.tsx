import { Badge, Button, Circle, EmptyState, HStack, Skeleton, Stack, Table, Text } from '@chakra-ui/react'
import { ArrowRight, Check, FolderX } from 'lucide-react'
import { listSamplesOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { datasetDomain, datasetIcon } from '../utils/dataset-icons'

interface SampleTableProps {
  onChoose: (name: string) => void
  disabled: boolean
  /** Shown when this machine has no challenge package, so the person can switch to uploading. */
  onUploadInstead: () => void
  /** The dataset this release already uses, if any. */
  chosen?: string
}

/** The challenge datasets as one table: subject, size and a button to use each. */
export function SampleTable({ onChoose, disabled, onUploadInstead, chosen }: SampleTableProps) {
  const { data, isLoading } = useApiQuery(listSamplesOptions())
  if (isLoading) {
    return (
      <Stack gap="2" aria-busy="true" aria-label="Loading challenge datasets">
        {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} h="14" rounded="l2" />)}
      </Stack>
    )
  }
  if (!data?.length) {
    return (
      <EmptyState.Root size="sm" borderWidth="1px" borderStyle="dashed" borderColor="border.emphasized" rounded="l3">
        <EmptyState.Content>
          <EmptyState.Indicator><FolderX /></EmptyState.Indicator>
          <EmptyState.Title>No challenge package on this machine</EmptyState.Title>
          <EmptyState.Description>Put the challenge package next to the repository, or upload your own CSV files.</EmptyState.Description>
          <Button variant="outline" size="sm" onClick={onUploadInstead}>Upload CSV files instead</Button>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }
  return (
    <Table.ScrollArea borderWidth="1px" borderColor="border" rounded="l3" bg="bg.panel">
      <Table.Root size="md" interactive css={{ '& td': { verticalAlign: 'middle' } }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Dataset</Table.ColumnHeader>
            <Table.ColumnHeader hideBelow="sm">Subject</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Tables</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end" hideBelow="sm">Size</Table.ColumnHeader>
            <Table.ColumnHeader><Text srOnly>Action</Text></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((sample) => {
            const DatasetIcon = datasetIcon(sample.name)
            const domain = datasetDomain(sample.name)
            const inUse = sample.name === chosen
            return (
              <Table.Row key={sample.name} bg={inUse ? 'brand.subtle' : undefined}>
                <Table.Cell>
                  <HStack gap="3">
                    <Circle size="9" colorPalette={domain.palette} bg="colorPalette.subtle" color="colorPalette.fg" flexShrink="0">
                      <DatasetIcon size={17} aria-hidden="true" />
                    </Circle>
                    <Text fontFamily="mono" fontWeight="semibold">{sample.name}</Text>
                    {inUse && <Badge colorPalette="brand" variant="solid" size="sm"><Check size={11} aria-hidden="true" />In use</Badge>}
                  </HStack>
                </Table.Cell>
                <Table.Cell hideBelow="sm" color="fg.muted">{domain.label}</Table.Cell>
                <Table.Cell textAlign="end" fontFamily="mono">{sample.tables.length}</Table.Cell>
                <Table.Cell textAlign="end" fontFamily="mono" hideBelow="sm" whiteSpace="nowrap">{sample.size_mb} MB</Table.Cell>
                <Table.Cell textAlign="end">
                  <Button size="sm" variant="outline" disabled={disabled} onClick={() => onChoose(sample.name)} aria-label={`Use ${sample.name}, ${domain.label}`}>
                    Use<ArrowRight aria-hidden="true" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}
