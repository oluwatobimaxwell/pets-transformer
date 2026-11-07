import { CircleCheck, EyeOff, Fingerprint, Hash, KeyRound, MessageSquareText, ScanFace, type LucideIcon } from 'lucide-react'

/**
 * Plain names for Detect's roles, the colour each shows in, and its icon, so meaning never rests on colour alone.
 * `palette` colours the tag on light and dark surfaces; `hex` colours the role's layer in the 3D model on the deep stage.
 * Mandarin is reserved for what identifies a person on its own; forest for what is harmless.
 */
const ROLE_WORDS: Record<string, { label: string; palette: string; hex: string; icon: LucideIcon }> = {
  direct_identifier: { label: 'Identifies alone', palette: 'accent', hex: '#FD550A', icon: Fingerprint },
  technical_identifier: { label: 'Technical ID', palette: 'yellow', hex: '#F2B544', icon: KeyRound },
  quasi_identifier: { label: 'Clue', palette: 'blue', hex: '#8DB8DF', icon: ScanFace },
  sensitive_attribute: { label: 'Private fact', palette: 'pink', hex: '#E98AB4', icon: EyeOff },
  free_text: { label: 'Free text', palette: 'purple', hex: '#B9A6F2', icon: MessageSquareText },
  record_key: { label: 'Row ID', palette: 'gray', hex: '#A3C2B7', icon: Hash },
  non_sensitive: { label: 'Harmless', palette: 'brand', hex: '#8FD3B6', icon: CircleCheck },
}

export const ROLE_OPTIONS = Object.entries(ROLE_WORDS).map(([value, word]) => ({ value, label: word.label }))

export const ROLE_ORDER = Object.keys(ROLE_WORDS)

export function roleWord(role: string) {
  return ROLE_WORDS[role] ?? { label: role, palette: 'gray', hex: '#A3C2B7', icon: Hash }
}
