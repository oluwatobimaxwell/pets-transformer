import { Outlet } from 'react-router-dom'
import { Box, Container, Flex, HStack, Text } from '@chakra-ui/react'
import { Lock } from 'lucide-react'
import { SiteHeader } from './components/site-header'
import { SITE } from '@/shared/utils/site-config'

export function MainLayout() {
  return (
    <Flex direction="column" minH="100dvh">
      <SiteHeader />
      <Box as="main" flex="1">
        <Container maxW="6xl" py={{ base: '6', md: '10' }}>
          <Outlet />
        </Container>
      </Box>
      <Box as="footer" borderTopWidth="1px" borderColor="border">
        <Container maxW="6xl" py="5">
          <HStack gap="2" color="fg.muted">
            <Lock size={14} aria-hidden="true" />
            <Text textStyle="sm">
              {SITE.name} runs on this machine. Uploaded data, keys and row maps never leave it.
            </Text>
          </HStack>
        </Container>
      </Box>
    </Flex>
  )
}
