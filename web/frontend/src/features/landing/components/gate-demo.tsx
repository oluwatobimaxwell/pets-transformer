import { useRef, type KeyboardEvent } from 'react'
import { Box, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { FileSpreadsheet } from 'lucide-react'
import { DEMO_STAGES } from '../content'
import { useAutoAdvance } from '../hooks/use-auto-advance'
import { GateTable } from './gate-table'
import { StageStrip } from './stage-strip'

const STAGE_MS = 5200

/** The hero's live demo: one release in four moments, auto-advancing until the person picks one. */
export function GateDemo() {
  const { index, pick, pause, resume } = useAutoAdvance(DEMO_STAGES.length, STAGE_MS)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const stage = DEMO_STAGES[index]!

  // Arrow keys move between tabs, as for any tab list
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = (index + step + DEMO_STAGES.length) % DEMO_STAGES.length
    pick(next)
    tabs.current[next]?.focus()
  }

  return (
    <Box as="figure" m="0" rounded="l3" borderWidth="1px" borderColor="deep.line" bg="deep.raised" overflow="hidden" color="deep.fg"
      onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume}>
      <HStack px="4" py="2.5" gap="3" borderBottomWidth="1px" borderColor="deep.line" fontSize="xs" color="deep.muted">
        <FileSpreadsheet size={14} aria-hidden="true" />
        <Text fontFamily="mono">ed_visits.csv</Text>
        <Text hideBelow="sm">4 of 46,398 visits shown</Text>
        <Text ms="auto" fontFamily="mono" color="forest.300">HEALTH-S1</Text>
      </HStack>
      <Box h="2px" bg="deep.line" aria-hidden="true">
        <Box key={index} h="full" bg="mandarin.500" transformOrigin="left" animation={`grow ${STAGE_MS}ms linear`} />
      </Box>
      <Stack gap="4" p={{ base: '3', md: '4' }}>
        <GateTable stage={index} label={`${stage.title}. ${stage.text}`} />
        <StageStrip stage={index} />
      </Stack>
      <Stack as="figcaption" gap="3" px={{ base: '3', md: '4' }} pt="3" pb="4" borderTopWidth="1px" borderColor="deep.line">
        <Flex role="tablist" aria-label="How a release goes" gap="1" wrap="wrap" onKeyDown={onKey}>
          {DEMO_STAGES.map((item, n) => {
            const selected = n === index
            return (
              <Box asChild key={item.tag} display="inline-flex" gap="2" alignItems="center" px="3" py="1.5" rounded="l2" fontSize="sm" fontWeight="semibold"
                borderWidth="1px" borderColor={selected ? 'deep.line' : 'transparent'} bg={selected ? 'deep' : 'transparent'}
                color={selected ? 'white' : 'deep.muted'} transition="background 200ms, color 200ms" _hover={{ color: 'white' }}>
                <button ref={(el) => { tabs.current[n] = el }} type="button" role="tab" id={`demo-tab-${n}`} aria-controls="demo-panel"
                  aria-selected={selected} tabIndex={selected ? 0 : -1} onClick={() => pick(n)}>
                  <Text as="span" fontFamily="mono" fontSize="xs" color={selected ? 'mandarin.500' : 'inherit'}>{String(n + 1).padStart(2, '0')}</Text>
                  {item.tag}
                </button>
              </Box>
            )
          })}
        </Flex>
        <Box id="demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${index}`} key={index} minH="4.6em" animation="rise 420ms var(--chakra-easings-out)" aria-live="polite">
          <Text fontWeight="semibold" fontSize="md" color="white">{stage.title}</Text>
          <Text mt="1" fontSize="sm" lineHeight="1.55" color="deep.muted">{stage.text}</Text>
        </Box>
      </Stack>
    </Box>
  )
}
