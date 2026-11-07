import { Link } from 'react-router-dom'
import { Badge, Box, Button, Container, Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { ArrowRight, Lock, Upload } from 'lucide-react'
import { Path } from '@/router/paths'
import { DEEP_OUTLINE } from '../utils/deep-button'
import { SAMPLE_LINK } from '../utils/links'
import { GateDemo } from './gate-demo'

/** The first screen: the promise, the two ways in, and the gate working on four visits. */
export function LandingHero() {
  return (
    <Box as="section" aria-labelledby="hero-title" bg="deep" color="deep.fg" position="relative" overflow="hidden" py={{ base: '12', md: '16', xl: '20' }}>
      <Box aria-hidden="true" position="absolute" top="-40%" right="-10%" w="70%" h="140%" pointerEvents="none"
        bg="radial-gradient(closest-side, rgba(47,163,127,0.16), transparent)" />
      <Container maxW="7xl" position="relative">
        <Grid templateColumns={{ base: 'minmax(0, 1fr)', xl: 'minmax(0, 0.9fr) minmax(0, 1.1fr)' }} gap={{ base: '10', xl: '14' }} alignItems="center">
          <Stack gap="6" className="stagger">
            <Badge alignSelf="start" size="lg" bg="deep.raised" color="forest.300" borderWidth="1px" borderColor="deep.line">
              <Lock size={13} aria-hidden="true" />A privacy release gate that runs on your machine
            </Badge>
            <Heading as="h1" id="hero-title" color="white" fontSize={{ base: '4xl', md: '6xl', xl: '6xl' }} lineHeight="1.02" letterSpacing="-0.035em" fontWeight="bold">
              Protect the data.<br /><Text as="span" color="forest.300">Prove it still works.</Text>
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.65" color="deep.muted" maxW="50ch">
              Tell it who will receive a dataset. It protects the data, proves the data is still useful for that recipient, and blocks any release that fails.
            </Text>
            <HStack gap="3" flexWrap="wrap">
              <Button asChild size="lg" colorPalette="accent">
                <Link to={SAMPLE_LINK}>Try the healthcare sample<ArrowRight aria-hidden="true" /></Link>
              </Button>
              <Button asChild size="lg" {...DEEP_OUTLINE}>
                <Link to={Path.ReleaseData}><Upload aria-hidden="true" />Upload your own data</Link>
              </Button>
            </HStack>
            <Text fontSize="sm" color="deep.muted">CSV files. No sign-in, and no outside service or language model ever sees the data.</Text>
          </Stack>
          <Box animation="rise 700ms cubic-bezier(0.2, 0.8, 0.2, 1) 150ms backwards">
            <GateDemo />
          </Box>
        </Grid>
      </Container>
    </Box>
  )
}
