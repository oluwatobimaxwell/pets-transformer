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

/** The challenge scenarios written for this dataset, as one list of radio choices with each recipient's limits. */
export function ScenarioList({ dataset, chosen, onChoose }: ScenarioListProps) {
  const { data, isLoading } = useApiQuery(listScenariosOptions({ query: { dataset } }))
  if (isLoading) {
    return (
      <Stack gap="2" aria-busy="true" aria-label="Loading scenarios">
        {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} h="24" rounded="l2" />)}
      </Stack>
    )
  }
  return (
    <Stack role="radiogroup" aria-label="Challenge scenarios" gap="0" borderWidth="1px" borderColor="border" rounded="l3" bg="bg.panel" overflow="hidden"
      divideY="1px" divideColor="border">
      {(data ?? []).map((scenario) => {
        const selected = chosen === scenario.id
        const trust = trustWord(scenario.trust_level)
        const TrustIcon = trust.icon
        return (
          <Box asChild key={scenario.id} textAlign="start" w="full" px={{ base: '4', md: '5' }} py="4" bg={selected ? 'brand.subtle' : 'transparent'}
            transition="background 180ms" _hover={selected ? undefined : { bg: 'bg.subtle' }}>
            <button type="button" role="radio" aria-checked={selected} aria-label={`${scenario.id}: ${scenario.title}`} onClick={() => onChoose(scenario.id)}>
              <HStack gap="4" align="start">
                <Circle size="5" mt="0.5" flexShrink="0" borderWidth="1.5px" borderColor={selected ? 'brand.solid' : 'border.emphasized'}
                  bg={selected ? 'brand.solid' : 'bg.panel'} color="brand.contrast" aria-hidden="true">
                  {selected && <Check size={12} strokeWidth={3} />}
                </Circle>
                <Stack gap="1.5" flex="1" minW="0">
                  <HStack justify="space-between" align="start" gap="3" flexWrap="wrap">
                    <Text fontWeight="semibold">
                      <Text as="span" fontFamily="mono" me="2" color={selected ? 'brand.fg' : 'fg'}>{scenario.id}</Text>
                      {scenario.title}
                    </Text>
                    {scenario.public_output === 'answers' && (
                      <Badge colorPalette="blue" variant="subtle"><Calculator size={12} aria-hidden="true" />Answers only, with differential privacy</Badge>
                    )}
                    {scenario.public_output === 'blocked' && (
                      <Badge colorPalette="orange" variant="subtle"><OctagonX size={12} aria-hidden="true" />Public: will be blocked</Badge>
                    )}
                  </HStack>
                  <Text textStyle="sm" color="fg.muted">For {scenario.recipient}. {scenario.purpose}</Text>
                  <HStack gap="4" flexWrap="wrap" textStyle="xs" color="fg.muted" pt="0.5">
                    <Badge colorPalette={trust.palette} variant="subtle" size="sm"><TrustIcon size={12} aria-hidden="true" />{trust.label}</Badge>
                    <HStack gap="1.5"><ListChecks size={13} aria-hidden="true" />{scenario.task_ids.length} required questions</HStack>
                    {scenario.k ? <HStack gap="1.5"><Users size={13} aria-hidden="true" />At least {scenario.k} look-alikes per row</HStack> : null}
                  </HStack>
                </Stack>
              </HStack>
            </button>
          </Box>
        )
      })}
    </Stack>
  )
}
