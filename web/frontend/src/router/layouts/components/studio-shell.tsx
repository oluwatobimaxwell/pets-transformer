import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box, Flex, Grid, HStack, Text } from '@chakra-ui/react'
import { WifiOff } from 'lucide-react'
import { listSamplesOptions } from '@/api/generated/@tanstack/react-query.gen'
import { BootLoader } from '@/shared/components/boot-loader'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { useOnline } from '@/shared/hooks/use-online'
import { StudioRail } from '@/features/release'
import { pageOrder } from '../utils/page-order'
import { StudioTopBar } from './studio-top-bar'

/** The boot screen shows once per page load, not on every move between studio pages. */
let booted = false

/** The studio's frame: the boot screen, the rail, the top bar and the page, which swings in from the direction of travel. */
export function StudioShell() {
  const location = useLocation()
  const online = useOnline()
  const shell = useRef<HTMLDivElement>(null)
  const main = useRef<HTMLElement>(null)
  const health = useApiQuery(listSamplesOptions())
  // Decided once at mount: the loader then fades itself out when the API answers
  const [showBoot] = useState(!booted)
  const ready = booted || health.isSuccess

  useEffect(() => {
    if (health.isSuccess) booted = true
  }, [health.isSuccess])
  useEffect(() => {
    shell.current?.toggleAttribute('inert', !ready)
  }, [ready])

  // The direction of travel decides which way the next page swings in
  const order = pageOrder(location.pathname)
  const previous = useRef(order)
  const direction = useRef<'fwd' | 'back'>('fwd')
  if (previous.current !== order) {
    direction.current = order > previous.current ? 'fwd' : 'back'
    previous.current = order
  }
  useEffect(() => {
    main.current?.scrollTo?.({ top: 0 })
  }, [location.pathname])

  return (
    <>
      {showBoot && (
        <BootLoader ready={ready} error={health.errorMessage ?? (health.isError ? 'The API did not answer.' : null)}
          retrying={health.isFetching} onRetry={() => void health.refetch()} />
      )}
      <Grid ref={shell} templateColumns={{ base: 'minmax(0, 1fr)', lg: '300px minmax(0, 1fr)' }} h="100dvh">
        <Box hideBelow="lg" minH="0" h="100dvh">
          <StudioRail />
        </Box>
        <Flex direction="column" minW="0" minH="0" h="100dvh">
          <StudioTopBar />
          <Box as="main" ref={main} id="main" tabIndex={-1} flex="1" overflowY="auto" outline="none">
            <Box maxW="6xl" mx="auto" px={{ base: '4', md: '8' }} py={{ base: '6', md: '8' }}>
              {!online && (
                <HStack role="status" gap="3" mb="6" colorPalette="orange" bg="colorPalette.subtle" color="colorPalette.fg" borderWidth="1px"
                  borderColor="colorPalette.muted" rounded="l3" p="4">
                  <WifiOff size={18} aria-hidden="true" />
                  <Text textStyle="sm"><b>You're offline.</b> Nothing is lost. Actions work again when the connection to the API returns.</Text>
                </HStack>
              )}
              <div key={location.pathname} className="screen" data-dir={direction.current}>
                <Outlet />
              </div>
            </Box>
          </Box>
        </Flex>
      </Grid>
    </>
  )
}
