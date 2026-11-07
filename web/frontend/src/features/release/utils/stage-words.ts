import { Calculator, Filter, Flag, Play, ScanSearch, ShieldCheck, Shuffle, SlidersHorizontal, type LucideIcon } from 'lucide-react'

/** How each stage of a run reads in the progress log. */
const STAGE_ICONS: Record<string, LucideIcon> = {
  start: Play,
  detect: ScanSearch,
  select: Filter,
  tune: SlidersHorizontal,
  transform: Shuffle,
  verify: ShieldCheck,
  answers: Calculator,
  done: Flag,
}

export function stageIcon(stage: string): LucideIcon {
  return STAGE_ICONS[stage] ?? Play
}

/** What the gate does, in order, for the last look before a run. */
export const GATE_STAGES = [
  { key: 'detect', label: 'Detect', says: 'Labels every column' },
  { key: 'select', label: 'Select', says: 'Keeps what the questions need' },
  { key: 'tune', label: 'Tune', says: 'Finds the lightest protection' },
  { key: 'transform', label: 'Transform', says: 'Pseudonymises and generalises' },
  { key: 'verify', label: 'Verify', says: 'Attacks it, then decides' },
] as const
