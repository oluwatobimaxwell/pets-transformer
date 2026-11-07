import { Badge, Button, HStack, NativeSelect, Table, Text } from '@chakra-ui/react'
import type { ColumnOut, ReviewDecisionIn } from '@/api/generated'
import { ROLE_OPTIONS } from '../utils/role-words'
import { SUBTYPES } from '../utils/subtype-options'
import { RoleBadge } from './role-badge'

interface ColumnRowProps {
  column: ColumnOut
  decision: ReviewDecisionIn | undefined
  onDecide: (role: string, subtype: string) => void
}

/** One column: what Detect found, why, and the person's correction or confirmation. */
export function ColumnRow({ column, decision, onDecide }: ColumnRowProps) {
  const role = decision?.role ?? column.role
  const subtype = decision?.subtype ?? column.subtype
  const unsure = column.needs_review && !decision
  return (
    <Table.Row bg={unsure ? 'orange.subtle' : undefined}>
      <Table.Cell fontFamily="mono" whiteSpace="nowrap">{column.key}</Table.Cell>
      <Table.Cell>
        <HStack gap="2" flexWrap="wrap">
          <RoleBadge role={column.role} />
          <Text textStyle="xs" color="fg.muted">{Math.round(column.confidence * 100)}% sure</Text>
          {column.needs_review && column.best_guess_role && (
            <Text textStyle="xs" color="fg.muted">best guess: {column.best_guess_role.replace(/_/g, ' ')}</Text>
          )}
        </HStack>
        <Text textStyle="xs" color="fg.muted" mt="1">{column.reasons.join('. ')}</Text>
      </Table.Cell>
      <Table.Cell>
        <HStack gap="2" flexWrap="wrap">
          <NativeSelect.Root size="xs" width="auto">
            <NativeSelect.Field value={role} aria-label={`What ${column.key} is`} onChange={(e) => onDecide(e.currentTarget.value, subtype)}>
              {ROLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <NativeSelect.Root size="xs" width="auto">
            <NativeSelect.Field value={subtype} aria-label={`Type of ${column.key}`} onChange={(e) => onDecide(role, e.currentTarget.value)}>
              {SUBTYPES.map((value) => <option key={value} value={value}>{value.replace(/_/g, ' ').toLowerCase()}</option>)}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </HStack>
      </Table.Cell>
      <Table.Cell>
        {decision ? <Badge colorPalette="green">Decided</Badge>
          : unsure ? <Button size="xs" variant="outline" onClick={() => onDecide(role, subtype)}>Confirm</Button>
          : <Text textStyle="xs" color="fg.muted">Detected</Text>}
      </Table.Cell>
    </Table.Row>
  )
}
