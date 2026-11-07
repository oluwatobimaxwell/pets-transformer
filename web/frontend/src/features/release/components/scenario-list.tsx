import { Badge, Box, Circle, HStack, Skeleton, Stack, Text } from '@chakra-ui/react'
import { Calculator, Check, ListChecks, OctagonX, Users } from 'lucide-react'
import { listScenariosOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { trustWord } from '../utils/trust-words'

interface ScenarioListProps {
  dataset: string
  chosen: string | null
  onChoose: (scenarioId: string) => void
}

/** The challenge scenarios written for this sample dataset. Each card is one choice, like a radio button. */
export function ScenarioList({ dataset, chosen, onChoose }: ScenarioListProps) {
  const { data, isLoading } = useApiQuery(listScenariosOptions({ query: { dataset } }))
  if (isLoading) {
    return (
      <Stack gap="3" aria-busy="true" aria-label="Loading scenarios">
        {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} h="28" rounded="l3" />)}
      </Stack>
    )
  }
  return (
    <Stack gap="3" role="radiogroup" aria-label="Challenge scenarios">
      {(data ?? []).map((scenario) => {
        const selected = chosen === scenario.id
        const trust = trustWord(scenario.trust_level)
        const TrustIcon = trust.icon
        return (
          <Box asChild key={scenario.id} textAlign="start" w="full" rounded="l3" p={{ base: '4', md: '5' }} borderWidth="1px"
            bg={selected ? 'brand.subtle' : 'bg.panel'} borderColor={selected ? 'brand.solid' : 'border'}
            boxShadow={selected ? '0 0 0 1px var(--chakra-colors-brand-solid)' : undefined}
            transition="border-color 180ms, background 180ms" _hover={selected ? undefined : { borderColor: 'brand.border' }}>
            <button type="button" role="radio" aria-checked={selected} aria-label={`${scenario.id}: ${scenario.title}`} onClick={() => onChoose(scenario.id)}>
              <HStack gap="4" align="start">
                <Circle size="9" flexShrink="0" bg={selected ? 'brand.solid' : 'bg.muted'} color={selected ? 'brand.contrast' : 'fg'}>
                  {selected ? <Check size={18} strokeWidth={2.5} aria-hidden="true" /> : <TrustIcon size={18} aria-hidden="true" />}
                </Circle>
                <Stack gap="2" flex="1" minW="0">
                  <HStack justify="space-between" align="start" gap="3" flexWrap="wrap">
                    <Text fontWeight="semibold">
                      <Text as="span" fontFamily="mono" me="2">{scenario.id}</Text>
                      {scenario.title}
                    </Text>
                    {scenario.public_output === 'answers' && (
                      <Badge colorPalette="blue" variant="subtle"><Calculator size={12} aria-hidden="true" />Public: answers only, with differential privacy</Badge>
                    )}
                    {scenario.public_output === 'blocked' && (
                      <Badge colorPalette="orange" variant="subtle"><OctagonX size={12} aria-hidden="true" />Public: will be blocked</Badge>
                    )}
                  </HStack>
                  <Text textStyle="sm" color="fg.muted">For {scenario.recipient}. {scenario.purpose}</Text>
                  <HStack gap="4" flexWrap="wrap" textStyle="xs" color="fg.muted">
                    <HStack gap="1.5"><TrustIcon size={13} aria-hidden="true" />{trust.label}</HStack>
                    <HStack gap="1.5"><ListChecks size={13} aria-hidden="true" />{scenario.task_ids.length} required questions</HStack>
                    {scenario.k ? <HStack gap="1.5"><Users size={13} aria-hidden="true" />At least {scenario.k} look-alikes per row</HStack> : null}
                  </HStack>
                </Stack>
                <Text textStyle="sm" fontWeight="medium" color={selected ? 'brand.fg' : 'fg.muted'} hideBelow="sm">{selected ? 'Chosen' : 'Choose'}</Text>
              </HStack>
            </button>
          </Box>
        )
      })}
    </Stack>
  )
}
