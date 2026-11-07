import { Outlet } from 'react-router-dom'
import { Box, Container, Flex, Text } from '@chakra-ui/react'
import { SiteHeader } from './components/site-header'
import { SITE } from '@/shared/utils/site-config'

export function MainLayout() {
  return (
    <Flex direction="column" minH="100dvh">
      <SiteHeader />
      <Box as="main" flex="1">
        <Container maxW="6xl" py={{ base: '8', md: '10' }}>
          <Outlet />
        </Container>
      </Box>
      <Box as="footer" borderTopWidth="1px" borderColor="border.muted">
        <Container maxW="6xl" py="6">
          <Text textStyle="sm" color="fg.muted">
            {SITE.name} runs on this machine. Uploaded data, keys and row maps never leave it.
          </Text>
        </Container>
      </Box>
    </Flex>
  )
}
