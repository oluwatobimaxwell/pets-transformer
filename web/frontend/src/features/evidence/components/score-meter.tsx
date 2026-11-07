import { Box } from '@chakra-ui/react'

interface ScoreMeterProps {
  /** 0–1. */
  value: number | null | undefined
  palette: string
  label: string
  /** Marks where the engine's bands begin: Rough, Close and Same answer. */
  ticks?: boolean
}

const BAND_TICKS = [0.5, 0.8, 0.95]

/** A thin meter for a score or a risk, with the band marks when they help read it. */
export function ScoreMeter({ value, palette, label, ticks = false }: ScoreMeterProps) {
  const share = Math.max(0, Math.min(1, value ?? 0))
  return (
    <Box position="relative" h="1.5" rounded="full" bg="bg.muted" role="img" aria-label={label} colorPalette={palette}>
      <Box h="full" w={`${share * 100}%`} minW={share > 0 ? '1.5' : '0'} bg="colorPalette.solid" rounded="full" transformOrigin="left"
        animation="grow 700ms var(--chakra-easings-out)" />
      {ticks && BAND_TICKS.map((tick) => (
        <Box key={tick} aria-hidden="true" position="absolute" top="-2px" bottom="-2px" w="1px" bg="border.emphasized" left={`${tick * 100}%`} />
      ))}
    </Box>
  )
}
