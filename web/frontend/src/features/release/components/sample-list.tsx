import { Box, Circle, EmptyState, HStack, SimpleGrid, Skeleton, Stack, Text } from '@chakra-ui/react'
import { ArrowRight, FolderX, HardDrive, Table2 } from 'lucide-react'
import { listSamplesOptions } from '@/api/generated/@tanstack/react-query.gen'
import { useApiQuery } from '@/shared/hooks/use-api-query'
import { datasetIcon } from '../utils/dataset-icons'

interface SampleListProps {
  onChoose: (name: string) => void
  disabled: boolean
}

const GRID = { base: 1, sm: 2, xl: 3 }

/** The challenge datasets, usable without uploading anything. Each card is one button. */
export function SampleList({ onChoose, disabled }: SampleListProps) {
  const { data, isLoading } = useApiQuery(listSamplesOptions())
  if (isLoading) {
    return (
      <SimpleGrid columns={GRID} gap="3" aria-busy="true" aria-label="Loading challenge datasets">
        {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} h="20" rounded="l3" />)}
      </SimpleGrid>
    )
  }
  if (!data?.length) {
    return (
      <EmptyState.Root size="sm" borderWidth="1px" borderStyle="dashed" rounded="l3">
        <EmptyState.Content>
          <EmptyState.Indicator><FolderX /></EmptyState.Indicator>
          <EmptyState.Title>No challenge package found</EmptyState.Title>
          <EmptyState.Description>No challenge package found on this machine. Upload your own CSV files instead.</EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }
  return (
    <SimpleGrid columns={GRID} gap="3">
      {data.map((sample) => {
        const DatasetIcon = datasetIcon(sample.name)
        return (
          <Box asChild key={sample.name} textAlign="start" borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" p="4"
            transition="border-color 180ms, background 180ms" _hover={{ borderColor: 'brand.border', bg: 'brand.subtle' }}
            _disabled={{ opacity: 0.6, cursor: 'progress' }} css={{ '&:hover .go': { color: 'brand.fg', transform: 'translateX(2px)' } }}>
            <button type="button" disabled={disabled} onClick={() => onChoose(sample.name)} aria-label={`Use ${sample.name}`}>
              <HStack gap="3" align="start">
                <Circle size="9" bg="bg.muted" color="fg" flexShrink="0"><DatasetIcon size={18} aria-hidden="true" /></Circle>
                <Stack gap="1" flex="1" minW="0">
                  <Text fontFamily="mono" fontWeight="medium" truncate>{sample.name}</Text>
                  <HStack gap="3" color="fg.muted" textStyle="xs" fontVariantNumeric="tabular-nums">
                    <HStack gap="1"><Table2 size={12} aria-hidden="true" />{sample.tables.length} {sample.tables.length === 1 ? 'table' : 'tables'}</HStack>
                    <HStack gap="1"><HardDrive size={12} aria-hidden="true" />{sample.size_mb} MB</HStack>
                  </HStack>
                </Stack>
                <Box className="go" color="fg.subtle" transition="color 180ms, transform 180ms" alignSelf="center"><ArrowRight size={16} aria-hidden="true" /></Box>
              </HStack>
            </button>
          </Box>
        )
      })}
    </SimpleGrid>
  )
}
