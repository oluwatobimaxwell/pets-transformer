import { Link } from 'react-router-dom'
import { Box, Button, Container, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { ArrowRight } from 'lucide-react'
import { Path } from '@/router/paths'
import { DEEP_OUTLINE } from '../utils/deep-button'
import { SAMPLE_LINK } from '../utils/links'

export function LandingCta() {
  return (
    <Box as="section" aria-labelledby="cta-title" bg="deep" color="deep.fg" py={{ base: '14', md: '24' }}>
      <Container maxW="7xl">
        <Stack gap="5" align={{ base: 'start', md: 'center' }} textAlign={{ base: 'start', md: 'center' }}>
          <Heading as="h2" id="cta-title" color="white" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold" letterSpacing="-0.03em" lineHeight="1.05" maxW="20ch">
            See it decide on real attacks, not promises
          </Heading>
          <Text color="deep.muted" maxW="60ch" fontSize={{ md: 'lg' }}>Every challenge dataset is synthetic and describes fictional people. Pick one, name a recipient, and watch the gate release, hold or block it.</Text>
          <HStack gap="3" flexWrap="wrap" justify={{ md: 'center' }} pt="2">
            <Button asChild size="lg" colorPalette="accent"><Link to={SAMPLE_LINK}>Try the healthcare sample<ArrowRight aria-hidden="true" /></Link></Button>
            <Button asChild size="lg" {...DEEP_OUTLINE}><Link to={Path.Runs}>See earlier runs</Link></Button>
          </HStack>
        </Stack>
      </Container>
    </Box>
  )
}
