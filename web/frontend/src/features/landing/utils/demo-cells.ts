import { roleWord } from '@/features/release/utils/role-words'
import { DEMO_STAGE, type DEMO_ROWS, type DemoColumn } from '../content'

/** The columns an attacker can already know, and the ones that name a person outright. */
export const CLUE_COLUMNS: DemoColumn[] = ['born', 'area', 'arrived']
const DIRECT_COLUMNS: DemoColumn[] = ['name', 'id']

/** A cell's text at a stage: the original, blank where names were dropped before the attack, then what the gate releases. */
export function cellValue(stage: number, column: DemoColumn, row: (typeof DEMO_ROWS)[number]) {
  if (stage >= DEMO_STAGE.protect) return row.released[column]
  if (stage === DEMO_STAGE.attack && DIRECT_COLUMNS.includes(column)) return ''
  return row.raw[column]
}

/** The cell's background: tinted by role while Detect reads, mandarin on the singled-out visit, a faint forest once released. */
export function cellTint(stage: number, role: string, singledOut: boolean) {
  if (stage === DEMO_STAGE.detect) return `${roleWord(role).hex}14`
  if (singledOut) return 'rgba(253,85,10,0.10)'
  return stage === DEMO_STAGE.release ? 'rgba(143,211,182,0.06)' : 'transparent'
}
