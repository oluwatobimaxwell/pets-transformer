import { HStack, Stack, Text } from '@chakra-ui/react'
import { SlidersHorizontal } from 'lucide-react'
import { tuningWords } from '../utils/tuning-words'
import { EvidenceCard } from './evidence-card'

interface TuningSummaryProps {
  tuning: Record<string, string>
  recoding: string[]
}

/** How coarse Tune made each kind of clue, and any rows it recoded to keep look-alikes. */
export function TuningSummary({ tuning, recoding }: TuningSummaryProps) {
  const levels = Object.entries(tuning)
  if (!levels.length && !recoding.length) return null
  return (
    <EvidenceCard title="Settings Tune chose" description="The least coarsening that gave every row enough look-alikes.">
      <Stack gap="3">
        {levels.length > 0 && (
          <HStack gap="2" flexWrap="wrap">
            {levels.map(([subtype, level]) => {
              const words = tuningWords(subtype, level)
              return (
                <HStack key={subtype} gap="1.5" borderWidth="1px" borderColor="border" rounded="full" ps="2.5" pe="3" py="1" textStyle="xs" bg="bg.subtle">
                  <SlidersHorizontal size={12} aria-hidden="true" />
                  <Text fontWeight="semibold">{words.subtype}</Text>
                  <Text color="fg.muted">{words.level}</Text>
                </HStack>
              )
            })}
          </HStack>
        )}
        {recoding.map((line) => <Text key={line} textStyle="sm" color="fg.muted">{line}</Text>)}
      </Stack>
    </EvidenceCard>
  )
}
