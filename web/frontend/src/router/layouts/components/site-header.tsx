import { Link } from 'react-router-dom'
import { Box, Button, Container, HStack } from '@chakra-ui/react'
import { Path } from '@/router/paths'
import { BrandLogo } from '@/shared/components/brand-logo'
import { ColorModeButton } from '@/shared/components/ui/color-mode-button'

export function SiteHeader() {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg="bg/80"
      backdropFilter="saturate(180%) blur(16px)"
      borderBottomWidth="1px"
      borderColor="border.muted"
    >
      <Container maxW="6xl">
        <HStack h="16" justify="space-between">
          <BrandLogo />
          <HStack gap="2">
            <Button asChild variant="ghost" size="sm">
              <Link to={Path.Home}>New release</Link>
            </Button>
            <ColorModeButton />
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}
