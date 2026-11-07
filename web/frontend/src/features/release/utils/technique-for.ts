import type { TechniqueRulesOut } from '@/api/generated'

/**
 * The technique a column gets when a question needs it, by the engine's own rules (served from rules.yaml):
 * its subtype's override if there is one, otherwise its role's rule.
 */
export function techniqueFor(rules: TechniqueRulesOut | undefined, role: string, subtype: string) {
  if (!rules) return undefined
  return rules.subtypes[subtype] ?? rules.roles[role]
}
