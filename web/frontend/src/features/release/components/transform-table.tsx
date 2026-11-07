import { Box, Table } from '@chakra-ui/react'
import type { PreviewOut } from '@/api/generated'
import { techniqueWord } from '../utils/technique-words'
import { MorphCell } from './morph-cell'
import { TransformColumnHead } from './transform-column-head'

interface TransformTableProps {
  preview: PreviewOut
  /** Bumped to play the turn again. */
  replay: number
  /** The gate's scan crosses the table while it tunes. */
  scanning: boolean
}

/** The table turns column by column, and down each column row by row, so the eye follows one technique at a time. */
const COLUMN_STEP_MS = 120
const ROW_STEP_MS = 45
const PICK_START_MS = 150
const PICK_STEP_MS = 80

/** The first rows of the main released table, each cell turning from its original value into its protected one. */
export function TransformTable({ preview, replay, scanning }: TransformTableProps) {
  const rows = Array.from({ length: preview.rows }, (_, row) => row)
  return (
    <Box position="relative" overflow="hidden">
      <Box overflowX="auto">
        <Table.Root size="sm" aria-label={`The first ${preview.rows} rows of ${preview.table}, before and after the gate`} aria-busy={scanning}>
          <Table.Header>
            <Table.Row bg="bg.subtle">
              <Table.ColumnHeader w="12" verticalAlign="top" py="3" textStyle="xs" color="fg.subtle" fontWeight="medium">Row</Table.ColumnHeader>
              {preview.columns.map((column, index) => (
                <TransformColumnHead key={`${replay}-${column.field}`} column={column} pickDelayMs={PICK_START_MS + index * PICK_STEP_MS}
                  turnDelayMs={column.after ? index * COLUMN_STEP_MS : null} />
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row}>
                <Table.Cell fontFamily="mono" textStyle="xs" color="fg.subtle" fontVariantNumeric="tabular-nums">{row + 1}</Table.Cell>
                {preview.columns.map((column, index) => {
                  const after = column.after ? column.after[row] ?? null : undefined
                  return (
                    <Table.Cell key={column.field} py="2.5">
                      <MorphCell key={`${replay}-${String(after)}`} before={column.before?.[row]} after={after}
                        delayMs={index * COLUMN_STEP_MS + row * ROW_STEP_MS} palette={techniqueWord(column.technique).palette} />
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      {scanning && (
        <Box position="absolute" insetY="0" left="0" w="20%" pointerEvents="none" aria-hidden="true"
          bgGradient="to-r" gradientFrom="transparent" gradientVia="accent.solid/12" gradientTo="transparent"
          style={{ animation: 'scan-x 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite' }} />
      )}
    </Box>
  )
}
