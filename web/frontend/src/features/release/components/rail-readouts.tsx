import { Grid, Stack, Text } from '@chakra-ui/react'
import { CountUp } from '@/shared/components/motion/count-up'
import { READOUT_FORMATS } from '../utils/readout-format'
import type { Readout } from '../utils/studio-view'

/** Two live figures under the model that count between values as the data's state changes. */
export function RailReadouts({ readouts }: { readouts: Readout[] }) {
  if (!readouts.length) return null
  return (
    <Grid templateColumns="1fr 1fr" gap="2">
      {readouts.map((readout) => (
        <Stack key={readout.label} gap="0.5" bg="deep.raised" borderWidth="1px" rounded="l2" px="3" py="2.5"
          borderColor={readout.tone === 'hot' ? 'rgba(253,85,10,0.5)' : 'deep.line'} transition="border-color 400ms">
          <Text textStyle="xs" color="deep.muted" fontWeight="medium">{readout.label}</Text>
          <Text fontFamily="mono" fontSize="2xl" lineHeight="1.1" letterSpacing="-0.02em"
            color={readout.tone === 'hot' ? 'mandarin.500' : readout.tone === 'cool' ? 'forest.300' : 'deep.fg'}>
            {readout.value === null
              ? <Text as="span" fontSize="md">{readout.note ?? '–'}</Text>
              : <CountUp value={readout.value} format={READOUT_FORMATS[readout.format]} />}
          </Text>
          {readout.value !== null && readout.note && <Text textStyle="xs" color="deep.muted">{readout.note}</Text>}
        </Stack>
      ))}
    </Grid>
  )
}
