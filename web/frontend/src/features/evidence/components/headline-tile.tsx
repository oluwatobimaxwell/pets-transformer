import { Stack, Text } from '@chakra-ui/react'
import type { HeadlineTileOut } from '@/api/generated'
import { CountUp } from '@/shared/components/motion/count-up'
import { headlineMeter, headlineValue } from '../utils/headline-value'
import { ScoreMeter } from './score-meter'

/** One headline number, counted up when it appears: what it is, the figure, a meter where the figure is a share, and what it means. */
export function HeadlineTile({ tile }: { tile: HeadlineTileOut }) {
  const { prefix, main, suffix } = headlineValue(tile)
  const meter = headlineMeter(tile)
  return (
    <Stack gap="2.5" p={{ base: '4', md: '5' }} minW="0">
      <Text textStyle="sm" fontWeight="medium" color="fg.muted">{tile.label}</Text>
      <Text fontFamily="mono" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="medium" letterSpacing="-0.03em" lineHeight="1" fontVariantNumeric="tabular-nums">
        {prefix && <Text as="span" color="fg.muted" fontSize="0.6em" me="1">{prefix}</Text>}
        <CountUp value={tile.value} format={(value) => headlineValue({ ...tile, value }).main} />
        {suffix && <Text as="span" color="fg.muted" fontSize="0.5em" ms="1.5" letterSpacing="0">{suffix}</Text>}
      </Text>
      {meter !== null && <ScoreMeter value={meter} palette="brand" label={`${tile.label}: ${main}${suffix ? ` ${suffix}` : ''}`} />}
      <Text textStyle="xs" color="fg.muted" lineClamp="3" title={tile.meaning}>{tile.meaning}</Text>
    </Stack>
  )
}
