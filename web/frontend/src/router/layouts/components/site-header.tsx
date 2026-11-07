import { Link } from 'react-router-dom'
import { Badge, Box, Button, Container, HStack, Text } from '@chakra-ui/react'
import { HardDrive, Plus } from 'lucide-react'
import { Path } from '@/router/paths'
import { BrandLogo } from '@/shared/components/brand-logo'
import { ColorModeButton } from '@/shared/components/ui/color-mode-button'

export function SiteHeader() {
  return (
    <Box as="header" position="sticky" top="0" zIndex="sticky" bg="bg.panel" borderBottomWidth="1px" borderColor="border">
      <Container maxW="6xl">
        <HStack h="16" justify="space-between" gap="4">
          <BrandLogo />
          <HStack gap="2">
            <Badge variant="outline" size="md" colorPalette="gray" hideBelow="md" title="Uploaded data, keys and row maps stay on this machine">
              <HardDrive size={12} aria-hidden="true" />
              Runs on this machine
            </Badge>
            <Button asChild variant="outline" size="sm">
              <Link to={Path.Home} aria-label="New release">
                <Plus aria-hidden="true" />
                <Text as="span" hideBelow="sm">New release</Text>
              </Link>
            </Button>
            <ColorModeButton />
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}
