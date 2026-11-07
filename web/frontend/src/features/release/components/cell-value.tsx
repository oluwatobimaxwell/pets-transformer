import { Text } from '@chakra-ui/react'
import { cellKind } from '../utils/cell-kind'

interface CellValueProps {
  value: string | null
  /** Protected values read in full ink; originals are quieter, since they are about to change. */
  protected?: boolean
}

/** One value in the live table. An empty cell and a withheld row say so in words, not as a gap. */
export function CellValue({ value, protected: isProtected = false }: CellValueProps) {
  const kind = cellKind(value)
  if (kind !== 'value') {
    return <Text as="span" textStyle="xs" fontStyle="italic" color="fg.subtle" whiteSpace="nowrap">{kind === 'blank' ? 'blank' : 'withheld'}</Text>
  }
  return (
    <Text as="span" fontFamily="mono" textStyle="xs" whiteSpace="nowrap" color={isProtected ? 'fg' : 'fg.muted'} title={value ?? undefined}
      fontWeight={isProtected ? 'medium' : 'normal'}>
      {value}
    </Text>
  )
}
