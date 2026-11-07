import { CircleCheck, EyeOff, Fingerprint, Hash, KeyRound, MessageSquareText, ScanFace, type LucideIcon } from 'lucide-react'

/** Plain names for Detect's roles, the colour each shows in, and its icon, so meaning never rests on colour alone. */
const ROLE_WORDS: Record<string, { label: string; palette: string; icon: LucideIcon }> = {
  direct_identifier: { label: 'Identifies alone', palette: 'red', icon: Fingerprint },
  technical_identifier: { label: 'Technical ID', palette: 'orange', icon: KeyRound },
  quasi_identifier: { label: 'Clue', palette: 'yellow', icon: ScanFace },
  sensitive_attribute: { label: 'Private fact', palette: 'purple', icon: EyeOff },
  free_text: { label: 'Free text', palette: 'blue', icon: MessageSquareText },
  record_key: { label: 'Row ID', palette: 'gray', icon: Hash },
  non_sensitive: { label: 'Harmless', palette: 'green', icon: CircleCheck },
}

export const ROLE_OPTIONS = Object.entries(ROLE_WORDS).map(([value, word]) => ({ value, label: word.label }))

export const ROLE_ORDER = Object.keys(ROLE_WORDS)

export function roleWord(role: string) {
  return ROLE_WORDS[role] ?? { label: role, palette: 'gray', icon: Hash }
}
