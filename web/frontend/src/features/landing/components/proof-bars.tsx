import { Box, Grid, HStack, Stack, Text } from '@chakra-ui/react'
import { PROOF } from '../content'
import { proofBars } from '../utils/proof-bars'

/** Usefulness kept per scenario, ours against the challenge's own baseline, as two bars that fill once. */
export function ProofBars() {
  return (
    <Grid as="dl" templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap={{ base: '5', md: '6' }}>
      {PROOF.map((item, index) => (
        <Stack key={item.id} gap="2.5">
          <HStack as="dt" justify="space-between" align="baseline" gap="3">
            <Text fontSize="sm" color="deep.fg" fontWeight="medium">{item.what}</Text>
            <Text fontFamily="mono" fontSize="xs" color="deep.muted" whiteSpace="nowrap">{item.id}</Text>
          </HStack>
          <Stack as="dd" m="0" gap="1.5">
            {proofBars(item).map((bar, n) => (
              <HStack key={bar.label} gap="3">
                <Box flex="1" h="2" rounded="full" bg="rgba(234,243,239,0.07)" overflow="hidden" title={bar.label}>
                  <Box h="full" w={`${bar.value * 100}%`} bg={bar.color} rounded="full" transformOrigin="left"
                    animation={`grow 900ms cubic-bezier(0.2, 0.8, 0.2, 1) ${300 + index * 120 + n * 60}ms backwards`} />
                </Box>
                <Text fontFamily="mono" fontSize="sm" w="10" textAlign="end" color={bar.strong ? 'forest.300' : 'deep.muted'}>
                  <Text as="span" srOnly>{bar.label}: </Text>{bar.value.toFixed(2)}
                </Text>
              </HStack>
            ))}
          </Stack>
        </Stack>
      ))}
    </Grid>
  )
}
