import type { EvidenceOut, RunOut } from '@/api/generated'
import { IDLE_SCENE } from '@/shared/components/core-model'
import { roleCounts, roleWord, runView, type DataView, type StudioView } from '@/features/release'

/** The group size the model can draw: two look-alikes at least, and no more than it has room for. */
const drawnGroup = (k: number) => Math.max(2, Math.min(12, k))

const plural = (count: number, word: string) => `${count.toLocaleString('en-US')} ${word}${count === 1 ? '' : 's'}`

/**
 * The data as it came in: every source column, layered by what Detect found it to be, identifiers included.
 * A public release has no column plan, so its original is the plain lattice of records that never leave.
 */
function originalView(evidence: EvidenceOut): DataView {
  if (!evidence.fields.length) {
    return {
      scene: { ...IDLE_SCENE, mode: 'data' },
      caption: evidence.answers
        ? 'The original records. They stay on this machine: a public release sends none of them, only noisy answers.'
        : 'The original records. The gate stopped before planning their columns.',
      legend: [],
      readouts: [],
    }
  }
  const counts = roleCounts(evidence.fields.map((field) => ({ key: field.field, role: field.role })))
  const columns = evidence.fields.length
  const tables = new Set(evidence.fields.map((field) => field.field.split('.')[0])).size
  const count = (role: string) => counts.find((item) => item.role === role)?.count ?? 0
  const identifying = count('direct_identifier')
  const clues = count('quasi_identifier')
  return {
    scene: { ...IDLE_SCENE, mode: 'classes', layers: counts.map(({ role, count: n }) => ({ color: roleWord(role).hex, share: n / columns })) },
    caption: `The original: ${plural(columns, 'column')} in ${plural(tables, 'table')}, every one of them. `
      + `${identifying} ${identifying === 1 ? 'identifies' : 'identify'} a person on ${identifying === 1 ? 'its' : 'their'} own and ${clues} ${clues === 1 ? 'is a clue' : 'are clues'}.`,
    legend: counts.map(({ role, count: n }) => ({ color: roleWord(role).hex, text: `${roleWord(role).label} ${n}` })),
    readouts: [
      { label: 'Columns', value: columns, format: 'int', note: `in ${plural(tables, 'table')}` },
      { label: 'Identify alone', value: identifying, format: 'int', note: 'name, ID and the like', tone: identifying ? 'hot' : 'cool' },
    ],
  }
}

/**
 * Both states of a finished run for the rail: the original, and what the gate made of it, with the protected side
 * drawn in the scenario's real look-alike group size and saying how many columns leave.
 */
export function runViews(run: RunOut, evidence: EvidenceOut | undefined): StudioView {
  const protectedView = runView(run)
  if (!evidence || run.status === 'error') return protectedView
  const leaving = evidence.fields.filter((field) => field.pet !== 'remove').length
  const k = evidence.scenario.k_required
  const rowsLeave = evidence.fields.length > 0 && run.status !== 'block'
  const detail = rowsLeave
    ? ` ${leaving} of ${plural(evidence.fields.length, 'column')} ${run.status === 'release' ? 'leave' : 'would leave'}${k ? `, every row among at least ${k} look-alikes` : ''}.`
    : ''
  return {
    ...protectedView,
    scene: k && protectedView.scene.mode === 'grouped' ? { ...protectedView.scene, k: drawnGroup(k) } : protectedView.scene,
    caption: protectedView.caption + detail,
    original: originalView(evidence),
  }
}
