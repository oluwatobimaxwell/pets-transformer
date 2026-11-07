import { Box, Text } from '@chakra-ui/react'
import { isToken, textParts } from '../utils/record-rows'

interface RecordCellProps {
  value: unknown
  /** Show every row with this pseudonym. */
  onToken: (token: string) => void
}

/** One released value: a pseudonym is a button that finds its other rows, redaction placeholders are marked, empty is a dash. */
export function RecordCell({ value, onToken }: RecordCellProps) {
  if (value === null || value === undefined || value === '') return <Text as="span" color="fg.subtle">–</Text>
  if (isToken(value)) {
    return (
      <Box asChild fontFamily="mono" textStyle="xs" color="brand.fg" textDecoration="underline" textDecorationStyle="dotted" textUnderlineOffset="3px"
        _hover={{ textDecorationStyle: 'solid' }}>
        <button type="button" onClick={() => onToken(value)} title="Show every row with this code">{value}</button>
      </Box>
    )
  }
  return (
    <>
      {textParts(String(value)).map((part, index) => part.placeholder
        ? <Box as="mark" key={index} bg="purple.subtle" color="purple.fg" rounded="l1" px="1" fontFamily="mono" textStyle="xs">{part.text}</Box>
        : <span key={index}>{part.text}</span>)}
    </>
  )
}
