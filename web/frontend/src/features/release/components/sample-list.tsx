import { Button, Card, SimpleGrid, Text } from '@chakra-ui/react'
import { listSamplesOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { LoadingSpinner } from '@/shared/components/loading-spinner'

interface SampleListProps {
  onChoose: (name: string) => void
  disabled: boolean
}

/** The challenge datasets, usable without uploading anything. */
export function SampleList({ onChoose, disabled }: SampleListProps) {
  const { data, isLoading } = useApiQuery(listSamplesOptions())
  if (isLoading) return <LoadingSpinner />
  if (!data?.length) return <Text color="fg.muted">No challenge package found on this machine. Upload your own CSV files instead.</Text>
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap="3">
      {data.map((sample) => (
        <Card.Root key={sample.name} variant="outline" size="sm">
          <Card.Body gap="1">
            <Card.Title fontFamily="mono">{sample.name}</Card.Title>
            <Card.Description>
              {sample.tables.length} {sample.tables.length === 1 ? 'table' : 'tables'}, {sample.size_mb} MB
            </Card.Description>
          </Card.Body>
          <Card.Footer>
            <Button size="sm" variant="outline" disabled={disabled} onClick={() => onChoose(sample.name)}>
              Use {sample.name}
            </Button>
          </Card.Footer>
        </Card.Root>
      ))}
    </SimpleGrid>
  )
}
