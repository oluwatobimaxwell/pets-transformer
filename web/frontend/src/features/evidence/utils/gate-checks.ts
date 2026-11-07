import { CircleCheck, CircleX, Info, type LucideIcon } from 'lucide-react'
import type { GateAttemptOut, GateCheckOut } from '@/api/generated'

export type CheckKind = 'pass' | 'fail' | 'note'

/** A check is a note when it only informs; otherwise it passed or failed. */
export function checkKind(check: GateCheckOut): CheckKind {
  if (check.severity === 'info') return 'note'
  return check.passed ? 'pass' : 'fail'
}

/** What a failed check costs the release. */
export const SEVERITY_WORDS: Record<string, string> = { block: 'Blocks release', review: 'Needs a person', info: 'Note' }

/** One attempt's checks counted by kind, failures first in the list. */
export function gateSummary(attempt: GateAttemptOut | undefined) {
  const checks = attempt?.checks ?? []
  const of = (kind: CheckKind) => checks.filter((check) => checkKind(check) === kind)
  return { total: checks.length, passed: of('pass'), failed: of('fail'), notes: of('note') }
}

/** How each kind of check shows: its icon, colour and word, so a result never rests on colour alone. */
export const CHECK_KINDS: Record<CheckKind, { icon: LucideIcon; color: string; word: string }> = {
  pass: { icon: CircleCheck, color: 'brand.fg', word: 'Passed' },
  fail: { icon: CircleX, color: 'red.fg', word: 'Failed' },
  note: { icon: Info, color: 'blue.fg', word: 'Note' },
}

const ORDER: Record<CheckKind, number> = { fail: 0, note: 1, pass: 2 }

/** An attempt's checks with failures first, then notes, then passes, each group in the engine's order. */
export function orderChecks(checks: GateCheckOut[]) {
  return checks.map((check, index) => ({ check, index })).sort((a, b) => ORDER[checkKind(a.check)] - ORDER[checkKind(b.check)] || a.index - b.index).map(({ check }) => check)
}
