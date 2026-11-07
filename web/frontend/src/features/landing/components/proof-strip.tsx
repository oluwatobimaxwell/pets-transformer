import { Box, Container, Flex, Text } from '@chakra-ui/react'
import { ProofBars } from './proof-bars'

/** The band under the hero: what the bars measure, then ours against the challenge baseline. */
export function ProofStrip() {
  return (
    <Box as="section" aria-labelledby="proof-title" bg="deep.raised" color="deep.fg" borderTopWidth="1px" borderBottomWidth="1px" borderColor="deep.line" py={{ base: '8', md: '10' }}>
      <Container maxW="7xl">
        <Flex gap={{ base: '6', xl: '12' }} direction={{ base: 'column', xl: 'row' }} align={{ xl: 'center' }}>
          <Text id="proof-title" fontSize="sm" color="deep.muted" maxW={{ xl: '26ch' }} flexShrink="0" lineHeight="1.6">
            Usefulness kept, against the challenge's own baseline. Self-assessed with its pets-eval toolkit.
          </Text>
          <Box flex="1"><ProofBars /></Box>
        </Flex>
      </Container>
    </Box>
  )
}
