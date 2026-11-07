import { Tabs, Text } from '@chakra-ui/react'
import type { EvidenceOut, RunOut } from '@/api/generated'
import { useEvidenceTab } from '../hooks/use-evidence-tab'
import { evidenceTabs, type EvidenceTab } from '../utils/evidence-tabs'
import { ColumnsPanel } from './columns-panel'
import { GatePanel } from './gate-panel'
import { OverviewPanel } from './overview-panel'
import { PrivacyPanel } from './privacy-panel'
import { RecordsPanel } from './records-panel'
import { UsefulnessPanel } from './usefulness-panel'

interface EvidenceTabsProps {
  run: RunOut
  evidence: EvidenceOut
}

/** The evidence in six views, the tab bar staying in reach as the page scrolls. The open tab lives in the address. */
export function EvidenceTabs({ run, evidence }: EvidenceTabsProps) {
  const [tab, setTab] = useEvidenceTab()
  return (
    <Tabs.Root value={tab} onValueChange={(event) => setTab(event.value as EvidenceTab)} variant="line" lazyMount>
      <Tabs.List position="sticky" top="0" zIndex="docked" bg="bg" overflowX="auto" overflowY="hidden" css={{ scrollbarWidth: 'none' }}>
        {evidenceTabs(evidence).map((item) => (
          <Tabs.Trigger key={item.value} value={item.value} flexShrink="0" fontWeight="medium" color="fg.muted" _selected={{ color: 'fg' }}>
            {item.label}
            {item.count ? <Text as="span" fontFamily="mono" textStyle="xs" color="fg.subtle" bg="bg.muted" rounded="full" px="1.5">{item.count}</Text> : null}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.Content value="overview" pt="6"><OverviewPanel run={run} evidence={evidence} onTab={setTab} /></Tabs.Content>
      <Tabs.Content value="usefulness" pt="6"><UsefulnessPanel tasks={evidence.tasks} /></Tabs.Content>
      <Tabs.Content value="privacy" pt="6"><PrivacyPanel evidence={evidence} /></Tabs.Content>
      <Tabs.Content value="columns" pt="6"><ColumnsPanel evidence={evidence} /></Tabs.Content>
      <Tabs.Content value="gate" pt="6"><GatePanel attempts={evidence.attempts} /></Tabs.Content>
      <Tabs.Content value="records" pt="6"><RecordsPanel runId={run.id} records={evidence.records} /></Tabs.Content>
    </Tabs.Root>
  )
}
