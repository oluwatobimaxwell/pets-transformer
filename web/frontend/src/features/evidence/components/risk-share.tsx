import { Badge } from '@chakra-ui/react'
import { tonePalette } from '@/features/release'
import { riskTone } from '../utils/risk-tone'
import { formatShare } from '../utils/share-format'

/** A share of people singled out, coloured by how bad it is, with the figure always written. */
export function RiskShare({ value }: { value: number | null | undefined }) {
  return (
    <Badge variant="subtle" colorPalette={value === null || value === undefined ? 'gray' : tonePalette(riskTone(value).tone)} fontFamily="mono" size="md">
      {formatShare(value)}
    </Badge>
  )
}
