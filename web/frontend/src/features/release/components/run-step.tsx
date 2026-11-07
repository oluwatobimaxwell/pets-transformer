import { Button, DataList, Grid, HStack, Stack, Text } from '@chakra-ui/react'
import { ShieldCheck } from 'lucide-react'
import { StatusAlert } from '@/shared/components/status-alert'
import type { ReleaseDraftApi } from '../hooks/use-release-draft'
import { useStartRun } from '../hooks/use-start-run'
import { TRUST_OPTIONS } from '../utils/trust-words'
import { GateStages } from './gate-stages'

interface RunStepProps {
  api: ReleaseDraftApi
}

/** A last look before the gate runs. */
export function RunStep({ api }: RunStepProps) {
  const { draft } = api
  const { start, isStarting, errorMessage } = useStartRun()
  const custom = draft.custom
  const trust = TRUST_OPTIONS.find((option) => option.value === custom.trust_level)?.label
  const items = draft.scenarioId
    ? [{ label: 'Scenario', value: draft.scenarioId }]
    : [
        { label: 'Recipient', value: custom.recipient || 'Not given' },
        { label: 'Trust', value: trust ?? custom.trust_level },
        { label: 'Look-alikes per row', value: custom.k ? `at least ${custom.k}` : 'no bar' },
        { label: 'Questions', value: String((custom.questions ?? []).length) },
      ]
  return (
    <Stack gap="6">
      {errorMessage && <StatusAlert message={errorMessage} />}
      <Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 2fr) minmax(0, 3fr)' }} gap="6" alignItems="start">
        <Stack gap="3" borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" p="5">
          <Text fontWeight="semibold">You are about to release</Text>
          <DataList.Root orientation="horizontal" size="sm">
            <DataList.Item>
              <DataList.ItemLabel>Data</DataList.ItemLabel>
              <DataList.ItemValue fontFamily="mono">{draft.dataset?.name} ({draft.dataset?.tables.length} tables)</DataList.ItemValue>
            </DataList.Item>
            {items.map((item) => (
              <DataList.Item key={item.label}>
                <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
                <DataList.ItemValue fontFamily={item.label === 'Scenario' ? 'mono' : undefined}>{item.value}</DataList.ItemValue>
              </DataList.Item>
            ))}
            <DataList.Item>
              <DataList.ItemLabel>Your column decisions</DataList.ItemLabel>
              <DataList.ItemValue fontVariantNumeric="tabular-nums">{Object.keys(draft.decisions).length}</DataList.ItemValue>
            </DataList.Item>
          </DataList.Root>
        </Stack>
        <Stack gap="5" borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" p="5">
          <GateStages />
          <Text textStyle="sm" color="fg.muted">
            The gate detects, selects, tunes, transforms and verifies, then releases, holds for review or blocks. Nothing is released unless every check passes.
          </Text>
          <HStack>
            <Button size="lg" onClick={() => start(draft)} loading={isStarting} loadingText="Starting">
              <ShieldCheck aria-hidden="true" />
              Run the release gate
            </Button>
          </HStack>
        </Stack>
      </Grid>
    </Stack>
  )
}
