import { Building2, FileSignature, FlaskConical, Globe, type LucideIcon } from 'lucide-react'

/** Trust levels, from most to least trusted recipient. */
export const TRUST_OPTIONS = [
  { value: 'internal', label: 'Internal team' },
  { value: 'controlled_research', label: 'Controlled research environment' },
  { value: 'contractual', label: 'Partner under contract' },
  { value: 'public', label: 'Anyone (public release)' },
] as const

const TRUST_ICONS: Record<string, LucideIcon> = {
  internal: Building2,
  controlled_research: FlaskConical,
  contractual: FileSignature,
  public: Globe,
}

/** Each trust level's tag colour: forest for the most trusted, mandarin for anyone at all, the attention colour. */
const TRUST_PALETTES: Record<string, string> = {
  internal: 'brand',
  controlled_research: 'blue',
  contractual: 'purple',
  public: 'accent',
}

export function trustWord(value: string) {
  return {
    label: TRUST_OPTIONS.find((option) => option.value === value)?.label ?? value,
    icon: TRUST_ICONS[value] ?? Building2,
    palette: TRUST_PALETTES[value] ?? 'gray',
  }
}
