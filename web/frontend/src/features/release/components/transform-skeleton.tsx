import { Box, Grid } from '@chakra-ui/react'

const ROWS = 6
const COLUMNS = 6

/** The live table before Select has chosen its columns: rows waiting, with Detect's scan running down them. */
export function TransformSkeleton() {
  return (
    <Box position="relative" overflow="hidden" p={{ base: '4', md: '5' }} aria-hidden="true">
      <Grid templateColumns={`repeat(${COLUMNS}, minmax(0, 1fr))`} gap="4">
        {Array.from({ length: ROWS * COLUMNS }, (_, cell) => (
          <Box key={cell} h={cell < COLUMNS ? '4' : '3'} w={`${60 + ((cell * 37) % 40)}%`} rounded="full" className="shimmer" />
        ))}
      </Grid>
      <Box position="absolute" insetX="0" top="0" h="35%" pointerEvents="none"
        bgGradient="to-b" gradientFrom="transparent" gradientVia="blue.solid/10" gradientTo="transparent"
        style={{ animation: 'scan 2.4s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate' }} />
    </Box>
  )
}
