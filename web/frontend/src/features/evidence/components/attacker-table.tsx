import { HStack, Table, Text } from '@chakra-ui/react'
import type { AttackerOut } from '@/api/generated'
import { EvidenceCard } from './evidence-card'
import { RiskShare } from './risk-share'

/** The engine's own stronger attacker: the share of known people it singles out as it learns more about them. */
export function AttackerTable({ rows }: { rows: AttackerOut[] }) {
  return (
    <EvidenceCard flush title="Our stronger attacker"
      description="The organisers' hidden attackers aren't available, so the engine runs its own. It knows each target's clue columns exactly, then adds facts an insider could know. Each figure is the share of targets matched to exactly one released row.">
      <Table.ScrollArea>
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row bg="bg.subtle">
              <Table.ColumnHeader ps={{ base: '4', md: '5' }}>Table</Table.ColumnHeader>
              <Table.ColumnHeader>Clues the attacker knows</Table.ColumnHeader>
              <Table.ColumnHeader>Clues only</Table.ColumnHeader>
              <Table.ColumnHeader>Plus the most revealing fact</Table.ColumnHeader>
              <Table.ColumnHeader pe={{ base: '4', md: '5' }}>Plus every kept fact</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.table} bg="transparent">
                <Table.Cell ps={{ base: '4', md: '5' }} fontFamily="mono" textStyle="xs">{row.table}</Table.Cell>
                <Table.Cell textStyle="xs" color="fg.muted" fontFamily="mono">{row.clues.join(', ')}</Table.Cell>
                <Table.Cell><RiskShare value={row.clues_only} /></Table.Cell>
                <Table.Cell>
                  {row.worst_fact ? (
                    <HStack gap="2"><RiskShare value={row.worst_fact_value} /><Text textStyle="xs" fontFamily="mono" color="fg.muted">+ {row.worst_fact}</Text></HStack>
                  ) : '–'}
                </Table.Cell>
                <Table.Cell pe={{ base: '4', md: '5' }}><RiskShare value={row.all_facts} /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </EvidenceCard>
  )
}
