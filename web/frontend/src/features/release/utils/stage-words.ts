import { Calculator, Filter, Flag, Play, ScanSearch, ShieldCheck, Shuffle, SlidersHorizontal, type LucideIcon } from 'lucide-react'

/** How each stage of a run reads in the progress log: its icon and its own tag colour. */
const STAGE_WORDS: Record<string, { icon: LucideIcon; palette: string }> = {
  start: { icon: Play, palette: 'gray' },
  detect: { icon: ScanSearch, palette: 'blue' },
  select: { icon: Filter, palette: 'purple' },
  tune: { icon: SlidersHorizontal, palette: 'yellow' },
  transform: { icon: Shuffle, palette: 'cyan' },
  verify: { icon: ShieldCheck, palette: 'brand' },
  answers: { icon: Calculator, palette: 'teal' },
  done: { icon: Flag, palette: 'accent' },
}

export function stageIcon(stage: string): LucideIcon {
  return STAGE_WORDS[stage]?.icon ?? Play
}

export function stagePalette(stage: string): string {
  return STAGE_WORDS[stage]?.palette ?? 'gray'
}

/** What the gate does, in order, for the last look before a run. */
export const GATE_STAGES = [
  { key: 'detect', label: 'Detect', says: 'Labels every column' },
  { key: 'select', label: 'Select', says: 'Keeps what the questions need' },
  { key: 'tune', label: 'Tune', says: 'Finds the lightest protection' },
  { key: 'transform', label: 'Transform', says: 'Pseudonymises and generalises' },
  { key: 'verify', label: 'Verify', says: 'Attacks it, then decides' },
] as const

/** A public recipient's run: the data is read, then answered with differential privacy instead of released as rows. */
export const ANSWER_STAGES = [
  { key: 'detect', label: 'Detect', says: 'Labels every column' },
  { key: 'answers', label: 'Answer', says: 'Noisy answers, no rows' },
] as const
