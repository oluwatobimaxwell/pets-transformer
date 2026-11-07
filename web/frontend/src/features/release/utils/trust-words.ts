/** Trust levels, from most to least trusted recipient. */
export const TRUST_OPTIONS = [
  { value: 'internal', label: 'Internal team' },
  { value: 'controlled_research', label: 'Controlled research environment' },
  { value: 'contractual', label: 'Partner under contract' },
  { value: 'public', label: 'Anyone (public release)' },
] as const
