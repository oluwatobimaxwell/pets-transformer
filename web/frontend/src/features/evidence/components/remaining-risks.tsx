import { Box, HStack, Stack, Text } from '@chakra-ui/react'
import { Info } from 'lucide-react'
import { EvidenceCard } from './evidence-card'

/** What the evidence can't rule out, said plainly so nobody reads a pass as a guarantee. */
export function RemainingRisks({ notes }: { notes: string[] }) {
  if (!notes.length) return null
  return (
    <EvidenceCard title="What remains" description="Limits of this evidence, and risks the gate allowed.">
      <Stack as="ul" gap="3" listStyleType="none">
        {notes.map((note) => (
          <HStack as="li" key={note} gap="2.5" align="start" textStyle="sm">
            <Box color="orange.fg" pt="0.5" flexShrink="0"><Info size={15} aria-hidden="true" /></Box>
            <Text color="fg">{note}</Text>
          </HStack>
        ))}
      </Stack>
    </EvidenceCard>
  )
}
