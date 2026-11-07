import { Box, Flex, Grid, HStack, Stack, Text } from '@chakra-ui/react'
import { Check, History, Lock } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Path } from '@/router/paths'
import { BrandLogo } from '@/shared/components/brand-logo'
import { CoreModel } from '@/shared/components/core-model'
import { CountUp } from '@/shared/components/motion/count-up'
import { useDraft, useStudioView } from '../context/studio-context'
import { STEP_TITLES } from '../types'
import { STEP_WORDS, stepOfPath } from '../utils/step-words'
import type { Readout } from '../utils/studio-view'

const FORMATS: Record<Readout['format'], (value: number) => string> = {
  int: (value) => Math.round(value).toLocaleString('en-US'),
  score: (value) => value.toFixed(2),
  percent: (value) => `${Math.round(value * 100)}%`,
}

/** Two live figures that count between values as the data's state changes. */
function Readouts({ readouts }: { readouts: Readout[] }) {
  if (!readouts.length) return null
  return (
    <Grid templateColumns="1fr 1fr" gap="2">
      {readouts.map((readout) => (
        <Stack key={readout.label} gap="0.5" bg="deep.raised" borderWidth="1px" rounded="l2" px="3" py="2.5"
          borderColor={readout.tone === 'hot' ? 'rgba(253,85,10,0.5)' : 'deep.line'} transition="border-color 400ms">
          <Text textStyle="xs" color="deep.muted" fontWeight="medium">{readout.label}</Text>
          <Text fontFamily="mono" fontSize="2xl" lineHeight="1.1" letterSpacing="-0.02em"
            color={readout.tone === 'hot' ? 'mandarin.500' : readout.tone === 'cool' ? 'forest.300' : 'deep.fg'}>
            {readout.value === null
              ? <Text as="span" fontSize="md">{readout.note ?? '–'}</Text>
              : <CountUp value={readout.value} format={FORMATS[readout.format]} />}
          </Text>
          {readout.value !== null && readout.note && <Text textStyle="xs" color="deep.muted">{readout.note}</Text>}
        </Stack>
      ))}
    </Grid>
  )
}

/**
 * The studio's left rail, dark in both themes: the 3D model of the data, what it currently shows, two live figures,
 * and the steps. Done steps turn forest with a tick, the current step is mandarin, and steps not yet open are locked.
 */
export function StudioRail() {
  const { reachable } = useDraft()
  const view = useStudioView()
  const location = useLocation()
  const navigate = useNavigate()
  const current = stepOfPath(location.pathname)

  return (
    <Stack as="aside" aria-label="Data model and progress" bg="deep" color="deep.fg" gap="4" p="4" h="full" overflowY="auto"
      css={{ scrollbarWidth: 'thin', scrollbarColor: '#1D4A3E transparent' }}>
      <Box px="1" pt="1"><BrandLogo onDeep /></Box>

      <Box as="figure" m="0" rounded="l3" borderWidth="1px" borderColor="deep.line" overflow="hidden"
        bgGradient="to-b" gradientFrom="deep.raised" gradientTo="deep">
        <CoreModel scene={view.scene} label={view.caption} />
        <Stack as="figcaption" gap="2" px="3.5" py="3" borderTopWidth="1px" borderColor="deep.line">
          <Text textStyle="sm" lineHeight="1.45" minH="2.9em" aria-live="polite">{view.caption}</Text>
          {view.legend.length > 0 && (
            <Flex as="ul" listStyleType="none" wrap="wrap" columnGap="3" rowGap="1" textStyle="xs" color="deep.muted">
              {view.legend.map((item) => (
                <HStack as="li" key={item.text} gap="1.5">
                  <Box w="2" h="2" rounded="full" bg={item.color} flexShrink="0" aria-hidden="true" />
                  {item.text}
                </HStack>
              ))}
            </Flex>
          )}
        </Stack>
      </Box>

      <Readouts readouts={view.readouts} />

      <Box as="nav" aria-label="Release steps">
        <Stack as="ol" listStyleType="none" gap="0.5">
          {STEP_TITLES.map((title, index) => {
            const { icon: StepIcon, path } = STEP_WORDS[index]!
            const isCurrent = index === current
            const done = current >= 0 && index < current
            const open = index <= reachable
            const Icon = done ? Check : StepIcon
            return (
              <li key={title}>
                <Grid asChild templateColumns="28px 1fr" alignItems="center" gap="3" w="full" px="2.5" py="1.5" rounded="l2"
                  textAlign="start" cursor={open ? 'pointer' : 'not-allowed'} opacity={open ? 1 : 0.45}
                  bg={isCurrent ? 'deep.raised' : 'transparent'} color={isCurrent ? 'white' : done ? 'deep.fg' : 'deep.muted'}
                  fontWeight={isCurrent ? 'semibold' : 'medium'} transition="background 200ms, color 200ms"
                  _hover={open && !isCurrent ? { bg: 'rgba(234,243,239,0.05)', color: 'deep.fg' } : undefined}>
                  <button type="button" disabled={!open} onClick={() => navigate(path)} aria-current={isCurrent ? 'step' : undefined}
                    aria-label={`Step ${index + 1}: ${title}${done ? ', done' : ''}${open ? '' : ', locked until the step before is done'}`}>
                    <Grid placeItems="center" boxSize="7" rounded="l1" borderWidth="1px" fontFamily="mono"
                      bg={isCurrent ? 'mandarin.500' : done ? 'forest.700' : 'deep.raised'}
                      borderColor={isCurrent ? 'mandarin.500' : done ? 'forest.600' : 'deep.line'}
                      color={isCurrent ? 'black' : done ? 'white' : 'deep.muted'}
                      boxShadow={isCurrent ? '0 3px 0 #C24103' : done ? '0 2px 0 #003326' : '0 2px 0 #021712'}
                      transform={isCurrent ? 'translateY(-1px)' : undefined}
                      transition="transform 250ms var(--chakra-easings-spring), background 250ms, box-shadow 250ms">
                      {open ? <Icon size={14} strokeWidth={done ? 2.4 : 1.9} aria-hidden="true" /> : <Lock size={13} aria-hidden="true" />}
                    </Grid>
                    <Stack gap="0" minW="0">
                      <Text as="span" textStyle="xs" color="deep.muted" fontWeight="medium">Step {index + 1}</Text>
                      <Text as="span" textStyle="sm" truncate>{title}</Text>
                    </Stack>
                  </button>
                </Grid>
              </li>
            )
          })}
        </Stack>
      </Box>

      <Box asChild display="grid" gridTemplateColumns="28px 1fr" alignItems="center" gap="3" px="2.5" py="1.5" rounded="l2"
        color="deep.muted" fontWeight="medium" textStyle="sm" transition="background 200ms, color 200ms"
        _hover={{ bg: 'rgba(234,243,239,0.05)', color: 'deep.fg' }}
        css={{ '&[aria-current=page]': { background: '#0A3329', color: 'white', fontWeight: 600 } }}>
        <NavLink to={Path.Runs} end={false}>
          <Grid placeItems="center" boxSize="7" rounded="l1" borderWidth="1px" borderColor="deep.line" bg="deep.raised"><History size={14} aria-hidden="true" /></Grid>
          Runs and results
        </NavLink>
      </Box>

      <HStack mt="auto" pt="3" gap="2" borderTopWidth="1px" borderColor="deep.line" textStyle="xs" color="deep.muted" align="start">
        <Box pt="0.5" flexShrink="0"><Lock size={13} aria-hidden="true" /></Box>
        <Text>Runs on this machine. Uploaded data, keys and row maps never leave it.</Text>
      </HStack>
    </Stack>
  )
}
