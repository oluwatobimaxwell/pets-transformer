import { Box, Container, HStack, Stack, Text } from '@chakra-ui/react'
import { BookOpen } from 'lucide-react'
import { BrandLogo } from '@/shared/components/brand-logo'
import { API_URL } from '@/shared/utils/api-url'

export function LandingFooter() {
  return (
    <Box as="footer" bg="deep" color="deep.muted" borderTopWidth="1px" borderColor="deep.line" py="8">
      <Container maxW="7xl">
        <Stack gap="3" fontSize="sm">
          <Box alignSelf="start"><BrandLogo onDeep /></Box>
          <Text maxW="80ch">
            Built at Since AI Hackathon 2026 for the TrustED PETs Transformer challenge. Every dataset used is synthetic and comes from the challenge
            package. This project isn't produced or endorsed by the TrustED consortium or the EU.
          </Text>
          <HStack gap="2">
            <BookOpen size={14} aria-hidden="true" />
            <Box asChild color="forest.300" textDecoration="underline" _hover={{ color: 'white' }}><a href={`${API_URL}/api/docs/`}>API documentation</a></Box>
          </HStack>
        </Stack>
      </Container>
    </Box>
  )
}
