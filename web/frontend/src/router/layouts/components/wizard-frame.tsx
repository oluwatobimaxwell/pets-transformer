import { Outlet, useLocation } from 'react-router-dom'
import { Box, Flex, Grid } from '@chakra-ui/react'
import { stepOfPath, WizardPanel, WizardTopBar } from '@/features/release'

/** The wizard's frame: the top bar, the release being built down the side, and the current step in the middle. */
export function WizardFrame() {
  const step = stepOfPath(useLocation().pathname)

  return (
    <Flex direction="column" h="100dvh" bg="bg">
      <WizardTopBar step={step} />
      <Grid flex="1" minH="0" templateColumns={{ base: 'minmax(0, 1fr)', lg: '300px minmax(0, 1fr)' }}>
        <Box hideBelow="lg" minH="0"><WizardPanel step={step} /></Box>
        <Box as="main" id="main" tabIndex={-1} overflowY="auto" outline="none" minH="0">
          <Outlet />
        </Box>
      </Grid>
    </Flex>
  )
}
