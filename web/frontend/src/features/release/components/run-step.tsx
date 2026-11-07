import { Button, DataList, Stack, Text } from '@chakra-ui/react'
import { StatusAlert } from '@/shared/components/status-alert'
import type { ReleaseDraftApi } from '../hooks/use-release-draft'
import { useStartRun } from '../hooks/use-start-run'
import { TRUST_OPTIONS } from '../utils/trust-words'

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
    <Stack gap="6" maxW="2xl">
      {errorMessage && <StatusAlert message={errorMessage} />}
      <DataList.Root orientation="horizontal">
        <DataList.Item>
          <DataList.ItemLabel>Data</DataList.ItemLabel>
          <DataList.ItemValue fontFamily="mono">{draft.dataset?.name} ({draft.dataset?.tables.length} tables)</DataList.ItemValue>
        </DataList.Item>
        {items.map((item) => (
          <DataList.Item key={item.label}>
            <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
            <DataList.ItemValue>{item.value}</DataList.ItemValue>
          </DataList.Item>
        ))}
        <DataList.Item>
          <DataList.ItemLabel>Your column decisions</DataList.ItemLabel>
          <DataList.ItemValue>{Object.keys(draft.decisions).length}</DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>
      <Text color="fg.muted">
        The gate detects, selects, tunes, transforms and verifies, then releases, holds for review or blocks. Nothing is released unless every check passes.
      </Text>
      <Button alignSelf="start" size="lg" onClick={() => start(draft)} loading={isStarting} loadingText="Starting">
        Run the release gate
      </Button>
    </Stack>
  )
}
