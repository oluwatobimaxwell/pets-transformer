import { Stack, Text } from '@chakra-ui/react'
import { ShieldCheck } from 'lucide-react'
import type { EvidenceOut } from '@/api/generated'
import { AttackerTable } from './attacker-table'
import { EvidenceEmpty } from './evidence-empty'
import { RiskGroup } from './risk-group'

/** How hard the release is to attack: the engine's own stronger attacker first, then the public scorecard's risks by table. */
export function PrivacyPanel({ evidence }: { evidence: EvidenceOut }) {
  const { attacker, risks, answers } = evidence
  if (!attacker.length && !risks.length) {
    return answers
      ? <EvidenceEmpty icon={ShieldCheck} title="No rows to attack" text="This release publishes noisy answers instead of rows, so its protection is the differential privacy guarantee on the Overview tab, not a record-level attack." />
      : <EvidenceEmpty icon={ShieldCheck} title="No attack was run" text="Nothing was released, so there was nothing to attack. The Gate checks tab shows why." />
  }
  const tables = [...new Set(risks.map((risk) => risk.table))]
  return (
    <Stack gap="5">
      <Text textStyle="sm" color="fg.muted" maxW="75ch">
        Each risk runs from 0, none found, to 1, every record exposed. The privacy score counts the worst risk as heavily as the
        average of the rest, because one open door is enough for an attacker.
      </Text>
      {attacker.length > 0 && <AttackerTable rows={attacker} />}
      {tables.length > 0 && (
        <Stack gap="3">
          <Text as="h3" fontWeight="semibold">Scorecard risks, from the public attackers</Text>
          {tables.map((table) => <RiskGroup key={table} table={table} risks={risks.filter((risk) => risk.table === table)} />)}
        </Stack>
      )}
    </Stack>
  )
}
