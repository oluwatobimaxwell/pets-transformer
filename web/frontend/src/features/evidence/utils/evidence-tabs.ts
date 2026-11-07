import type { EvidenceOut } from '@/api/generated'

export const EVIDENCE_TABS = ['overview', 'usefulness', 'privacy', 'columns', 'gate', 'records'] as const
export type EvidenceTab = (typeof EVIDENCE_TABS)[number]

const LABELS: Record<EvidenceTab, string> = {
  overview: 'Overview', usefulness: 'Usefulness', privacy: 'Privacy', columns: 'Columns', gate: 'Gate checks', records: 'Records',
}

/** Each tab with its label and, where it helps, how many things it holds. */
export function evidenceTabs(evidence: EvidenceOut) {
  const counts: Partial<Record<EvidenceTab, number>> = {
    usefulness: evidence.tasks.length,
    privacy: evidence.risks.length + evidence.attacker.length,
    columns: evidence.fields.length,
    gate: evidence.attempts.at(-1)?.checks.length ?? 0,
    records: evidence.records.tables.length,
  }
  return EVIDENCE_TABS.map((value) => ({ value, label: LABELS[value], count: counts[value] }))
}

export function isEvidenceTab(value: string | null): value is EvidenceTab {
  return EVIDENCE_TABS.includes(value as EvidenceTab)
}
