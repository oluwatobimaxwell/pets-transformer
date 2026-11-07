import type { ColumnOut, RunOut } from '@/api/generated'
import type { ReleaseDraft } from '../../types'
import { draftView, runView } from '../studio-view'

const DATASET = { id: 'ds1', name: 'health', source: 'sample', tables: [{ name: 'visits', columns: ['age', 'postcode', 'diagnosis', 'name'] }] }
const DRAFT: ReleaseDraft = { dataset: DATASET, scenarioId: 'HEALTH-S1', custom: { recipient: '', purpose: '', trust_level: 'contractual', k: 5, questions: [] }, decisions: {} }

function column(name: string, role: string, needsReview = false): ColumnOut {
  return { key: `visits.${name}`, table: 'visits', column: name, role, subtype: '', confidence: 0.9, needs_review: needsReview, reasons: [], best_guess_role: role, best_guess_subtype: '' }
}
const COLUMNS = [column('name', 'direct_identifier'), column('age', 'quasi_identifier'), column('postcode', 'quasi_identifier', true), column('diagnosis', 'sensitive_attribute')]

function run(status: string, summary: RunOut['summary'] = {}): RunOut {
  return { id: 'r1', dataset_id: 'ds1', scenario_id: 'HEALTH-S1', status, events: [{ at: '2026-11-07T10:00:00', stage: 'start', message: 'Started' }], summary }
}

describe('draftView', () => {
  it('is an idle sphere before any data is chosen', () => {
    const view = draftView(0, { ...DRAFT, dataset: null }, undefined, false)
    expect(view.scene.mode).toBe('idle')
    expect(view.readouts).toEqual([])
  })

  it('shows the chosen data as a lattice with its tables and columns', () => {
    const view = draftView(1, DRAFT, undefined, false)
    expect(view.scene.mode).toBe('data')
    expect(view.readouts.map((r) => [r.label, r.value])).toEqual([['Tables', 1], ['Columns', 4]])
    expect(view.caption).toContain('health')
  })

  it('scans while Detect reads the columns', () => {
    const view = draftView(2, DRAFT, undefined, false)
    expect(view.scene.busy).toBe(true)
  })

  it('layers the model by role and flags unsure columns', () => {
    const view = draftView(2, DRAFT, COLUMNS, false)
    expect(view.scene.mode).toBe('classes')
    const total = view.scene.layers.reduce((sum, layer) => sum + layer.share, 0)
    expect(total).toBeCloseTo(1)
    expect(view.legend.map((item) => item.text)).toEqual(['Identifies alone 1', 'Clue 2', 'Private fact 1'])
    const unsure = view.readouts.find((r) => r.label === 'Unsure')!
    expect(unsure.value).toBe(1)
    expect(unsure.tone).toBe('hot')
  })

  it("follows a person's decision over Detect's", () => {
    const decided = { ...DRAFT, decisions: { 'visits.postcode': { role: 'non_sensitive', subtype: '', reason: 'test' } } }
    const view = draftView(2, decided, COLUMNS, false)
    expect(view.legend.map((item) => item.text)).toContain('Harmless 1')
    expect(view.readouts.find((r) => r.label === 'Unsure')!.value).toBe(0)
  })
})

describe('runView', () => {
  it('scans while the gate works', () => {
    const view = runView(run('running'))
    expect(view.scene.busy).toBe(true)
    expect(view.caption).toContain('Started')
  })

  it('seals a release and groups its rows', () => {
    const view = runView(run('release', { scores: { privacy: 1, utility: 0.99 } }))
    expect(view.scene).toMatchObject({ mode: 'grouped', seal: 2, protect: true, exposed: 0 })
    expect(view.readouts.map((r) => r.value)).toEqual([1, 0.99])
  })

  it('draws the cage without the lock while a release waits for review', () => {
    expect(runView(run('review', { scores: { privacy: 0.9, utility: 0.9 } })).scene.seal).toBe(1)
  })

  it('leaves the remaining risk standing out when blocked, as 1 − privacy', () => {
    const view = runView(run('block', { scores: { privacy: 0.32, utility: 0.99 } }))
    expect(view.scene.mode).toBe('exposed')
    expect(view.scene.exposed).toBeCloseTo(0.68)
    expect(view.scene.seal).toBe(0)
    expect(view.readouts[0]!.tone).toBe('hot')
  })

  it('dissolves rows into answers for a public release', () => {
    const view = runView(run('release', { scores: { utility: 0.74 }, answers: { epsilon: 1, answered: 254, questions: 256 } }))
    expect(view.scene.mode).toBe('answers')
    expect(view.caption).toContain('254 noisy answers')
  })

  it('goes idle when the run failed', () => {
    expect(runView(run('error')).scene.mode).toBe('idle')
  })
})
