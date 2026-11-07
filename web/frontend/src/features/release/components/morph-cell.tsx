import { Box } from '@chakra-ui/react'
import { CellValue } from './cell-value'

interface MorphCellProps {
  /** The original value, or undefined when originals are never shown (uploaded data). */
  before: string | null | undefined
  /** The protected value, or undefined until the gate has written it. */
  after: string | null | undefined
  /** When this cell turns, so the table turns column by column, row by row. */
  delayMs: number
  /** The technique's colour, flashed behind the value as it turns. */
  palette: string
}

const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)'

/**
 * One cell turning from its original value into its protected one: the original lifts away and blurs, the protected
 * value rises into its place on a flash of the technique's colour. Both share one grid cell, so the column never jumps.
 */
export function MorphCell({ before, after, delayMs, palette }: MorphCellProps) {
  if (after === undefined) {
    if (before === undefined) return <Box h="3" w="20" rounded="full" className="shimmer" aria-hidden="true" />
    return <CellValue value={before} />
  }
  return (
    <Box display="inline-grid" colorPalette={palette} mx="-1.5" px="1.5" py="0.5" rounded="l1"
      style={{ animation: `cell-flash 1100ms ${EASE} ${delayMs + 140}ms` }}>
      {before !== undefined && (
        <Box gridArea="1 / 1" aria-hidden="true" style={{ animation: `value-out 380ms ${EASE} ${delayMs}ms forwards` }}>
          <CellValue value={before} />
        </Box>
      )}
      <Box gridArea="1 / 1" style={{ animation: `value-in 480ms ${EASE} ${delayMs + 140}ms backwards` }}>
        <CellValue value={after} protected />
      </Box>
    </Box>
  )
}
