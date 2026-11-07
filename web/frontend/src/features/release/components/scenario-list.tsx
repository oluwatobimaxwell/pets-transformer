import { Badge, Button, Card, HStack, Stack, Text } from '@chakra-ui/react'
import { listScenariosOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { LoadingSpinner } from '@/shared/components/loading-spinner'

interface ScenarioListProps {
  dataset: string
  chosen: string | null
  onChoose: (scenarioId: string) => void
}

/** The challenge scenarios written for this sample dataset. */
export function ScenarioList({ dataset, chosen, onChoose }: ScenarioListProps) {
  const { data, isLoading } = useApiQuery(listScenariosOptions({ query: { dataset } }))
  if (isLoading) return <LoadingSpinner />
  return (
    <Stack gap="3">
      {(data ?? []).map((scenario) => (
        <Card.Root key={scenario.id} variant={chosen === scenario.id ? 'subtle' : 'outline'} size="sm">
          <Card.Body gap="1">
            <HStack justify="space-between" flexWrap="wrap">
              <Card.Title>
                <Text as="span" fontFamily="mono" me="2">{scenario.id}</Text>
                {scenario.title}
              </Card.Title>
              {scenario.trust_level === 'public' && <Badge colorPalette="orange">Public: will be blocked</Badge>}
            </HStack>
            <Card.Description>For {scenario.recipient}. {scenario.purpose}</Card.Description>
            <Text textStyle="xs" color="fg.muted">
              {scenario.task_ids.length} required questions{scenario.k ? `, at least ${scenario.k} look-alikes per row` : ''}
            </Text>
          </Card.Body>
          <Card.Footer>
            <Button size="sm" variant={chosen === scenario.id ? 'solid' : 'outline'} onClick={() => onChoose(scenario.id)}>
              {chosen === scenario.id ? 'Chosen' : 'Choose'}
            </Button>
          </Card.Footer>
        </Card.Root>
      ))}
    </Stack>
  )
}
