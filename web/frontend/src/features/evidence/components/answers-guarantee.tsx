import { Box, HStack, Stack, Table, Text } from '@chakra-ui/react'
import { ShieldCheck } from 'lucide-react'
import type { AnswersOut } from '@/api/generated'
import { EvidenceCard } from './evidence-card'

/** For a public release: the differential privacy guarantee in plain lines, and how the budget is shared out. */
export function AnswersGuarantee({ answers }: { answers: AnswersOut }) {
  return (
    <EvidenceCard title="Answers, not rows: the guarantee" description="A public release gets noisy answers to its question list. No row leaves." flush>
      <Stack as="ul" gap="2.5" listStyleType="none" px={{ base: '4', md: '5' }} py="4">
        {answers.guarantee.map((line) => (
          <HStack as="li" key={line} gap="2.5" align="start" textStyle="sm">
            <Box color="brand.fg" pt="0.5" flexShrink="0"><ShieldCheck size={15} aria-hidden="true" /></Box>
            <Text>{line}</Text>
          </HStack>
        ))}
      </Stack>
      <Table.ScrollArea borderTopWidth="1px" borderColor="border.muted">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row bg="bg.subtle">
              <Table.ColumnHeader ps={{ base: '4', md: '5' }}>Questions</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">How many</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Budget (ε)</Table.ColumnHeader>
              <Table.ColumnHeader pe={{ base: '4', md: '5' }}>Noise</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {answers.families.map((family) => (
              <Table.Row key={family.questions} bg="transparent">
                <Table.Cell ps={{ base: '4', md: '5' }} fontFamily="mono" textStyle="xs">{family.questions}</Table.Cell>
                <Table.Cell textAlign="end" fontFamily="mono">{family.count}</Table.Cell>
                <Table.Cell textAlign="end" fontFamily="mono">{family.epsilon}</Table.Cell>
                <Table.Cell pe={{ base: '4', md: '5' }} color="fg.muted">{family.noise}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </EvidenceCard>
  )
}
