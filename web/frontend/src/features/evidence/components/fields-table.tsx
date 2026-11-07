import { Badge, Box, HStack, Stack, Table, Text } from '@chakra-ui/react'
import type { FieldEvidenceOut } from '@/api/generated'
import { RoleBadge, TechniqueChip } from '@/features/release'

/** Each column: where it came from, what Detect saw and how sure it was, the technique chosen, why, and which questions need it. */
export function FieldsTable({ fields }: { fields: FieldEvidenceOut[] }) {
  return (
    <Table.ScrollArea borderWidth="1px" borderColor="border" rounded="l3" bg="bg.panel" maxH="70vh">
      <Table.Root size="sm" stickyHeader css={{ '& td': { verticalAlign: 'top' } }}>
        <Table.Header>
          <Table.Row bg="bg.subtle">
            <Table.ColumnHeader ps="5">Column</Table.ColumnHeader>
            <Table.ColumnHeader>Detected as</Table.ColumnHeader>
            <Table.ColumnHeader>Technique</Table.ColumnHeader>
            <Table.ColumnHeader>Why</Table.ColumnHeader>
            <Table.ColumnHeader pe="5" minW="40">Needed by</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.length ? fields.map((field) => {
            const [table, column] = field.field.split('.')
            const renamed = field.output_column && field.output_column !== column
            const neededBy = field.needed_by ?? []
            return (
              <Table.Row key={field.field} bg="transparent">
                <Table.Cell ps="5">
                  <Stack gap="0.5">
                    <Text fontFamily="mono" textStyle="sm" fontWeight="medium">{column}</Text>
                    <Text fontFamily="mono" textStyle="xs" color="fg.subtle">{table}{renamed ? ` → ${field.output_column}` : ''}</Text>
                  </Stack>
                </Table.Cell>
                <Table.Cell>
                  <Stack gap="1" align="start">
                    <RoleBadge role={field.role} />
                    {field.confidence !== null && field.confidence !== undefined && (
                      <Text textStyle="xs" color={field.needs_review ? 'orange.fg' : 'fg.muted'}>
                        {Math.round(field.confidence * 100)}% sure{field.needs_review ? ', needs review' : ''}
                      </Text>
                    )}
                  </Stack>
                </Table.Cell>
                <Table.Cell><TechniqueChip technique={field.pet} /></Table.Cell>
                <Table.Cell textStyle="sm" color="fg.muted"><Box minW="56" maxW="md" whiteSpace="normal">{field.why}</Box></Table.Cell>
                <Table.Cell pe="5">
                  {neededBy.length ? (
                    <HStack gap="1" flexWrap="wrap">{neededBy.map((task) => <Badge key={task} variant="outline" colorPalette="gray" fontFamily="mono" size="sm">{task}</Badge>)}</HStack>
                  ) : <Text color="fg.subtle">–</Text>}
                </Table.Cell>
              </Table.Row>
            )
          }) : (
            <Table.Row bg="transparent"><Table.Cell colSpan={5} textAlign="center" py="10" color="fg.muted">No columns match.</Table.Cell></Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}
