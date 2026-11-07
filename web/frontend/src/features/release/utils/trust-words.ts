import { Building2, FileSignature, FlaskConical, Globe, type LucideIcon } from 'lucide-react'
import type { ChoiceOption } from '../components/choice-cards'

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

/** What each trust level means for the release, in one sentence, so the person can choose without the GDPR vocabulary. */
const TRUST_HELP: Record<string, string> = {
  internal: "Your own organisation's analysts. Pseudonyms stay stable so their work can link records.",
  controlled_research: 'Researchers in a secured environment under an agreement. Row-level data with coarser clues.',
  contractual: 'A partner or vendor bound by a data-processing contract. Only what their purpose needs.',
  public: 'Anyone at all. Gets noisy answers to a question list, never rows.',
}

export type TrustLevel = (typeof TRUST_OPTIONS)[number]['value']

/** The trust levels as choice cards: label, icon and what each means. */
export const TRUST_CHOICES: ChoiceOption<TrustLevel>[] = TRUST_OPTIONS.map((option) => ({
  value: option.value, label: option.label, icon: TRUST_ICONS[option.value] ?? Building2, text: TRUST_HELP[option.value] ?? '',
}))
