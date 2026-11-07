import { Link } from 'react-router-dom'
import { Box, Button, Container, HStack, Text } from '@chakra-ui/react'
import { ArrowRight } from 'lucide-react'
import { Path } from '@/router/paths'
import { BrandLogo } from '@/shared/components/brand-logo'
import { ColorModeButton } from '@/shared/components/ui/color-mode-button'
import { SECTION_LINKS } from '../utils/links'

export function LandingHeader() {
  return (
    <Box as="header" position="sticky" top="0" zIndex="sticky" bg="rgba(5,35,28,0.92)" backdropFilter="blur(12px)" borderBottomWidth="1px" borderColor="deep.line">
      <Container maxW="7xl">
        <HStack h="16" gap="6">
          <BrandLogo onDeep />
          <HStack as="nav" aria-label="Sections" gap="7" ms="auto" hideBelow="md" fontSize="sm">
            {SECTION_LINKS.map((link) => (
              <Box asChild key={link.href} color="deep.muted" _hover={{ color: 'white' }} transition="color 180ms"><a href={link.href}>{link.label}</a></Box>
            ))}
          </HStack>
          <HStack gap="2" ms={{ base: 'auto', md: '0' }}>
            <ColorModeButton color="deep.muted" _hover={{ bg: 'deep.raised', color: 'white' }} />
            <Button asChild size="sm" colorPalette="accent">
              <Link to={Path.ReleaseData} aria-label="Open the studio"><Text as="span" hideBelow="sm">Open the studio</Text><Text as="span" hideFrom="sm">Studio</Text><ArrowRight aria-hidden="true" /></Link>
            </Button>
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}
