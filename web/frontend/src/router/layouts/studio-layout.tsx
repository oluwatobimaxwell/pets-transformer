import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useIsMutating } from '@tanstack/react-query'
import { Box, Button, CloseButton, Drawer, Flex, Grid, HStack, Portal, Stack, Text } from '@chakra-ui/react'
import { Plus, RotateCcw, ShieldCheck, WifiOff } from 'lucide-react'
import { listSamplesOptions } from '@/api/generated/@tanstack/react-query.gen'
import { Path } from '@/router/paths'
import { BootLoader } from '@/shared/components/boot-loader'
import { BrandMark } from '@/shared/components/brand-mark'
import { CubeSpinner } from '@/shared/components/motion/cube-spinner'
import { ColorModeButton } from '@/shared/components/ui/color-mode-button'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { useOnline } from '@/shared/hooks/use-online'
import { StudioProvider, StudioRail, stepOfPath, useDraft, useStudioView } from '@/features/release'

/** The boot screen shows once per page load, not on every move between studio pages. */
let booted = false

/** Where a page sits in the studio, so the next one swings in from the direction of travel. */
function orderOf(pathname: string) {
  const step = stepOfPath(pathname)
  if (step >= 0) return step
  return pathname.replace(/\/+$/, '') === Path.Runs ? 4 : 5
}

const DATA_HANDLING = [
  { term: 'Where it runs', text: 'On this machine, with no sign-in. Never expose the app to a network.' },
  { term: 'What stays here', text: 'Uploaded data, keys and row maps stay in the workspace folder, which git ignores.' },
  { term: 'What the API serves', text: 'Only the protected release, the evidence and the dashboard. Never the original data or the row maps.' },
  { term: 'Pseudonyms', text: "Keyed with the secret in your .env file. Anyone with that key can link pseudonyms back, so it's never shared." },
  { term: 'No outside service', text: 'No large language model or outside service sees the data.' },
  { term: 'In this browser', text: 'Your choices and column names (never data values) stay in this tab until a run starts. The theme choice is remembered on this device.' },
]

function DataHandlingButton() {
  return (
    <Drawer.Root size="sm">
      <Drawer.Trigger asChild>
        <Button variant="ghost" size="sm">
          <ShieldCheck aria-hidden="true" />
          <Text as="span" hideBelow="md">Data handling</Text>
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>How your data is handled</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Stack as="dl" gap="4">
                {DATA_HANDLING.map((item) => (
                  <Box key={item.term}>
                    <Text as="dt" fontWeight="semibold">{item.term}</Text>
                    <Text as="dd" color="fg.muted" textStyle="sm" mt="0.5">{item.text}</Text>
                  </Box>
                ))}
              </Stack>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" aria-label="Close" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}

function TopBar() {
  const { draft, reset } = useDraft()
  const view = useStudioView()
  const navigate = useNavigate()
  const mutating = useIsMutating()
  const busy = mutating > 0 || view.scene.busy
  const recipient = draft.scenarioId ?? (draft.custom.recipient.trim() || null)

  return (
    <HStack as="header" gap="3" px={{ base: '4', md: '8' }} minH="16" borderBottomWidth="1px" borderColor="border" bg="bg"
      position="sticky" top="0" zIndex="sticky">
      <Box hideFrom="lg" asChild>
        <Link to={Path.Home} aria-label="PETs Transformer home"><BrandMark /></Link>
      </Box>
      <HStack flex="1" minW="0" gap="2" textStyle="sm" color="fg.muted" fontVariantNumeric="tabular-nums">
        {draft.dataset ? (
          <>
            <Text hideBelow="sm">Dataset</Text>
            <Text color="fg" fontWeight="semibold" fontFamily="mono" truncate maxW="48">{draft.dataset.name}</Text>
            {recipient && (
              <>
                <Text color="fg.subtle" aria-hidden="true" hideBelow="sm">/</Text>
                <Text hideBelow="sm">for</Text>
                <Text color="fg" fontWeight="semibold" truncate maxW="56" hideBelow="sm">{recipient}</Text>
              </>
            )}
          </>
        ) : (
          <Text hideBelow="sm">No dataset chosen</Text>
        )}
      </HStack>
      {busy && (
        <HStack role="status" gap="2" colorPalette="brand" bg="colorPalette.subtle" color="colorPalette.fg" borderWidth="1px" borderColor="colorPalette.border"
          rounded="full" px="3" py="1" textStyle="xs" fontFamily="mono" animation="rise 300ms var(--chakra-easings-out)" flexShrink="0">
          <CubeSpinner />
          Working
        </HStack>
      )}
      <HStack gap="1" flexShrink="0">
        {draft.dataset && (
          <Button variant="ghost" size="sm" onClick={() => { reset(); navigate(Path.ReleaseData) }} aria-label="Start over with new data">
            <RotateCcw aria-hidden="true" />
            <Text as="span" hideBelow="md">Start over</Text>
          </Button>
        )}
        <DataHandlingButton />
        <Button asChild variant="outline" size="sm">
          <Link to={Path.ReleaseData} aria-label="New release">
            <Plus aria-hidden="true" />
            <Text as="span" hideBelow="sm">New release</Text>
          </Link>
        </Button>
        <ColorModeButton />
      </HStack>
    </HStack>
  )
}

function Shell() {
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
  const order = orderOf(location.pathname)
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
          <TopBar />
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

/** Every studio page: the four steps, the run history and each run. */
export function StudioLayout() {
  return (
    <StudioProvider>
      <Shell />
    </StudioProvider>
  )
}
