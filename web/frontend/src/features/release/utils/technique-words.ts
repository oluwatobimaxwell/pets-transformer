import { Check, Eraser, KeyRound, Minus, Network, Scissors, SlidersHorizontal, type LucideIcon } from 'lucide-react'

/** Plain names for the engine's techniques, what each does in one line, and the icon and colour it shows in. */
const TECHNIQUE_WORDS: Record<string, { label: string; says: string; icon: LucideIcon; palette: string }> = {
  keyed_pseudonym: { label: 'Keyed pseudonym', says: 'Replaced by a code only your secret key can link', icon: KeyRound, palette: 'brand' },
  generalise: { label: 'Generalise', says: 'Made coarser, such as an age band or the hour only', icon: SlidersHorizontal, palette: 'blue' },
  shorten_code: { label: 'Shorter code', says: 'Cut to its first characters, such as A08.4 to A08', icon: Scissors, palette: 'yellow' },
  prefix_ip: { label: 'Prefix-preserving IP', says: 'Scrambled, with the network part kept', icon: Network, palette: 'cyan' },
  redact_text: { label: 'Redact text', says: 'Names, numbers and addresses become placeholders', icon: Eraser, palette: 'purple' },
  keep: { label: 'Keep as is', says: 'Not identifying, so it stays as it is', icon: Check, palette: 'gray' },
  remove: { label: 'Removed', says: 'No question needs it, so it never leaves', icon: Minus, palette: 'gray' },
}

export const TECHNIQUE_ORDER = Object.keys(TECHNIQUE_WORDS)

export function techniqueWord(technique: string) {
  return TECHNIQUE_WORDS[technique] ?? { label: technique.replace(/_/g, ' '), says: '', icon: Check, palette: 'gray' }
}
