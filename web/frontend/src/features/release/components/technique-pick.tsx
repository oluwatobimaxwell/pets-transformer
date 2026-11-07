import { Box } from '@chakra-ui/react'
import { TechniqueChip } from './technique-chip'

interface TechniquePickProps {
  technique: string | undefined
  /** Rows pick one after another, so the table reads as the gate working down the columns. */
  delayMs: number
}

/** The gate picking a column's technique: a short scan, then the technique lands. A changed role picks again. */
export function TechniquePick({ technique, delayMs }: TechniquePickProps) {
  if (!technique) return <Box h="5" w="24" rounded="full" className="shimmer" aria-hidden="true" />
  return (
    <Box key={technique} position="relative" display="inline-flex">
      <Box position="absolute" inset="0" rounded="full" className="shimmer" aria-hidden="true"
        style={{ animation: `leave 220ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delayMs}ms forwards` }} />
      <Box style={{ animation: `chip-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delayMs + 120}ms backwards` }}>
        <TechniqueChip technique={technique} />
      </Box>
    </Box>
  )
}
