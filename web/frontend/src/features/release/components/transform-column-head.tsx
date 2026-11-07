import { Box, Stack, Table, Text } from '@chakra-ui/react'
import type { PreviewColumnOut } from '@/api/generated'
import { techniqueWord } from '../utils/technique-words'
import { TechniquePick } from './technique-pick'

interface TransformColumnHeadProps {
  column: PreviewColumnOut
  pickDelayMs: number
  /** Set once the column's protected values are in, with when its cells start turning. */
  turnDelayMs: number | null
}

/** A column of the live table: its released name and source, the technique the gate picked, and a bar that fills as it turns. */
export function TransformColumnHead({ column, pickDelayMs, turnDelayMs }: TransformColumnHeadProps) {
  const source = column.field.split('.').slice(1).join('.')
  const word = techniqueWord(column.technique)
  return (
    <Table.ColumnHeader verticalAlign="top" py="3" minW="36">
      <Stack gap="2" align="start">
        <Stack gap="0">
          <Text fontFamily="mono" textStyle="xs" fontWeight="semibold" color="fg">{column.output_column}</Text>
          {source !== column.output_column && <Text textStyle="2xs" color="fg.subtle" fontWeight="normal">from {source}</Text>}
        </Stack>
        <TechniquePick technique={column.technique} delayMs={pickDelayMs} />
        <Box alignSelf="stretch" h="2px" rounded="full" bg="border" overflow="hidden" aria-hidden="true">
          {turnDelayMs !== null && (
            <Box h="full" colorPalette={word.palette} bg="colorPalette.solid" transformOrigin="left"
              style={{ animation: `grow 520ms cubic-bezier(0.2, 0.8, 0.2, 1) ${turnDelayMs}ms backwards` }} />
          )}
        </Box>
      </Stack>
    </Table.ColumnHeader>
  )
}
