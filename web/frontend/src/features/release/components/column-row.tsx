import { Badge, Button, HStack, NativeSelect, Progress, Stack, Table, Text } from '@chakra-ui/react'
import { Check, TriangleAlert } from 'lucide-react'
import type { ColumnOut, ReviewDecisionIn } from '@/api/generated'
import { ROLE_OPTIONS } from '../utils/role-words'
import { SUBTYPES } from '../utils/subtype-options'
import { RoleBadge } from './role-badge'

interface ColumnRowProps {
  column: ColumnOut
  decision: ReviewDecisionIn | undefined
  onDecide: (role: string, subtype: string) => void
}

/** One column: what Detect found, how sure it is and why, and the person's correction or confirmation. */
export function ColumnRow({ column, decision, onDecide }: ColumnRowProps) {
  const role = decision?.role ?? column.role
  const subtype = decision?.subtype ?? column.subtype
  const unsure = column.needs_review && !decision
  const sure = Math.round(column.confidence * 100)
  return (
    <Table.Row bg={unsure ? 'orange.subtle' : undefined}>
      <Table.Cell fontFamily="mono" whiteSpace="nowrap" fontWeight="medium">{column.key}</Table.Cell>
      <Table.Cell minW="64">
        <Stack gap="1.5">
          <HStack gap="2" flexWrap="wrap">
            <RoleBadge role={column.role} />
            <HStack gap="1.5" title={`Detect is ${sure}% sure`}>
              <Progress.Root value={sure} size="xs" w="12" colorPalette={unsure ? 'orange' : 'brand'} aria-label={`Detect is ${sure}% sure`}>
                <Progress.Track><Progress.Range /></Progress.Track>
              </Progress.Root>
              <Text textStyle="xs" color="fg.muted" fontVariantNumeric="tabular-nums">{sure}% sure</Text>
            </HStack>
            {column.needs_review && column.best_guess_role && (
              <Text textStyle="xs" color="fg.muted">best guess: {column.best_guess_role.replace(/_/g, ' ')}</Text>
            )}
          </HStack>
          <Text textStyle="xs" color="fg.muted">{column.reasons.join('. ')}</Text>
        </Stack>
      </Table.Cell>
      <Table.Cell minW="80">
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
      <Table.Cell whiteSpace="nowrap">
        {decision ? <Badge colorPalette="green" variant="subtle"><Check size={12} aria-hidden="true" />Decided</Badge>
          : unsure ? (
            <Stack gap="1.5" align="start">
              <HStack gap="1" color="orange.fg" textStyle="xs" fontWeight="medium"><TriangleAlert size={12} aria-hidden="true" />Unsure</HStack>
              <Button size="xs" variant="outline" onClick={() => onDecide(role, subtype)}><Check aria-hidden="true" />Confirm</Button>
            </Stack>
          )
          : <Text textStyle="xs" color="fg.muted">Detected</Text>}
      </Table.Cell>
    </Table.Row>
  )
}
