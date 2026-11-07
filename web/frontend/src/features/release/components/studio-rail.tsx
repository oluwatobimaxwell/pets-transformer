import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Grid, HStack, Stack, Text } from '@chakra-ui/react'
import { Lock } from 'lucide-react'
import { BrandLogo } from '@/shared/components/brand-logo'
import { useStudioView } from '../context/studio-context'
import { RAIL_LINKS } from '../utils/rail-links'
import type { DataSide } from '../utils/data-sides'
import { ModelFigure } from './model-figure'
import { RailReadouts } from './rail-readouts'
import { RailRuns } from './rail-runs'

/**
 * The studio's left rail, dark in both themes. On a run, the model shows what the gate made of the data, and a switch
 * shows the data as it came in; the caption, legend and figures follow the switch. Under it, the latest runs.
 */
export function StudioRail() {
  const view = useStudioView()
  const [side, setSide] = useState<DataSide>('protected')
  const shown = side === 'original' && view.original ? view.original : view

  return (
    <Stack as="aside" aria-label="The data and recent runs" bg="deep" color="deep.fg" gap="4" p="4" h="full" overflowY="auto"
      css={{ scrollbarWidth: 'thin', scrollbarColor: '#1D4A3E transparent' }}>
      <Box px="1" pt="1"><BrandLogo onDeep /></Box>
      <ModelFigure view={shown} side={view.original ? side : undefined} onSide={setSide} />
      <RailReadouts readouts={shown.readouts} />

      <Stack gap="0.5">
        {RAIL_LINKS.map((link) => (
          <Grid key={link.label} asChild templateColumns="28px 1fr" alignItems="center" gap="3" px="2.5" py="1.5" rounded="l2" color="deep.muted" fontWeight="medium"
            textStyle="sm" transition="background 200ms, color 200ms" _hover={{ bg: 'rgba(234,243,239,0.05)', color: 'deep.fg' }}
            css={{ '&[aria-current=page]': { background: '#0A3329', color: 'white', fontWeight: 600 } }}>
            <NavLink to={link.to} end={link.end}>
              <Grid placeItems="center" boxSize="7" rounded="l1" borderWidth="1px" borderColor="deep.line" bg="deep.raised"><link.icon size={14} aria-hidden="true" /></Grid>
              {link.label}
            </NavLink>
          </Grid>
        ))}
      </Stack>

      <RailRuns />

      <HStack mt="auto" pt="3" gap="2" borderTopWidth="1px" borderColor="deep.line" textStyle="xs" color="deep.muted" align="start">
        <Box pt="0.5" flexShrink="0"><Lock size={13} aria-hidden="true" /></Box>
        <Text>Runs on this machine. Uploaded data, keys and row maps never leave it.</Text>
      </HStack>
    </Stack>
  )
}
