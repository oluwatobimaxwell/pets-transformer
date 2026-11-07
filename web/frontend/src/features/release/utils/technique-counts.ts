import { TECHNIQUE_ORDER } from './technique-words'

/** How many columns get each technique, in the order techniques are explained. */
export function techniqueCounts(techniques: (string | undefined)[]) {
  const counts = new Map<string, number>()
  for (const technique of techniques) if (technique) counts.set(technique, (counts.get(technique) ?? 0) + 1)
  return TECHNIQUE_ORDER.filter((technique) => counts.has(technique)).map((technique) => ({ technique, count: counts.get(technique)! }))
}
