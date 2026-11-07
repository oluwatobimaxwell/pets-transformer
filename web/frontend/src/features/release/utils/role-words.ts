/** Plain names for Detect's roles, and the colour each shows in. */
const ROLE_WORDS: Record<string, { label: string; palette: string }> = {
  direct_identifier: { label: 'Identifies alone', palette: 'red' },
  technical_identifier: { label: 'Technical ID', palette: 'orange' },
  quasi_identifier: { label: 'Clue', palette: 'yellow' },
  sensitive_attribute: { label: 'Private fact', palette: 'purple' },
  free_text: { label: 'Free text', palette: 'blue' },
  record_key: { label: 'Row ID', palette: 'gray' },
  non_sensitive: { label: 'Harmless', palette: 'green' },
}

export const ROLE_OPTIONS = Object.entries(ROLE_WORDS).map(([value, word]) => ({ value, label: word.label }))

export function roleWord(role: string) {
  return ROLE_WORDS[role] ?? { label: role, palette: 'gray' }
}
