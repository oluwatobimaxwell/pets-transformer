import { Badge, Box, HStack, Stack, Table, Text } from '@chakra-ui/react'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { trustWord } from '@/features/release/utils/trust-words'
import { RESULTS } from '../content'

/** The same engine for five recipients, with the gate's decision and the self-assessed scores for each. */
export function ResultsTable() {
  return (
    <Table.ScrollArea borderWidth="1px" borderColor="border" rounded="l3" bg="bg.raised">
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Scenario</Table.ColumnHeader>
            <Table.ColumnHeader>Recipient</Table.ColumnHeader>
            <Table.ColumnHeader>Gate</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Privacy</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Usefulness</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Rows kept</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {RESULTS.map((row) => {
            const trust = trustWord(row.trust)
            const TrustIcon = trust.icon
            return (
              <Table.Row key={row.id}>
                <Table.Cell fontFamily="mono" fontWeight="semibold" whiteSpace="nowrap">{row.id}</Table.Cell>
                <Table.Cell minW="52">
                  <Stack gap="1.5">
                    <Text>{row.recipient}</Text>
                    <Badge colorPalette={trust.palette} variant="subtle" size="sm" alignSelf="start"><TrustIcon size={12} aria-hidden="true" />{trust.label}</Badge>
                  </Stack>
                </Table.Cell>
                <Table.Cell minW="52">
                  <HStack gap="2" align="start" color={row.status === 'release' ? 'brand.fg' : 'orange.fg'}>
                    <Box pt="0.5" flexShrink="0">{row.status === 'release' ? <CircleCheck size={15} aria-hidden="true" /> : <CircleAlert size={15} aria-hidden="true" />}</Box>
                    <Text color="fg">{row.gate}</Text>
                  </HStack>
                </Table.Cell>
                <Table.Cell textAlign="end" fontFamily="mono">{row.privacy}</Table.Cell>
                <Table.Cell textAlign="end" fontFamily="mono">{row.usefulness}</Table.Cell>
                <Table.Cell textAlign="end" fontFamily="mono" whiteSpace="nowrap">{row.rows}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}
