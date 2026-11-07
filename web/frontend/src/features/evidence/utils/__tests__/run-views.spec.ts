import type { EvidenceOut, RunOut } from '@/api/generated'
import { runViews } from '../run-views'

const run = { id: 'r1', status: 'release', events: [], summary: { scores: { privacy: 1, utility: 0.99 }, rows: { kept: 100, total: 100 } } } as unknown as RunOut
const evidence = {
  scenario: { id: 'S1', trust_level: 'controlled_research', k_required: 5 },
  answers: null,
  fields: [
    { field: 'visits.name', role: 'direct_identifier', pet: 'remove' },
    { field: 'visits.age', role: 'quasi_identifier', pet: 'generalise' },
    { field: 'labs.value', role: 'non_sensitive', pet: 'keep' },
  ],
} as unknown as EvidenceOut

describe('the run in the rail', () => {
  it('shows only the protected side until the evidence is in', () => {
    expect(runViews(run, undefined).original).toBeUndefined()
  })

  it('draws the original layered by role, identifiers included', () => {
    const { original } = runViews(run, evidence)
    expect(original?.scene.mode).toBe('classes')
    expect(original?.scene.layers).toHaveLength(3)
    expect(original?.caption).toBe('The original: 3 columns in 2 tables, every one of them. 1 identifies a person on its own and 1 is a clue.')
    expect(original?.readouts[1]).toMatchObject({ label: 'Identify alone', value: 1, tone: 'hot' })
  })

  it("draws the protected side in the scenario's group size and says how many columns leave", () => {
    const view = runViews(run, evidence)
    expect(view.scene.k).toBe(5)
    expect(view.caption).toContain('2 of 3 columns leave, every row among at least 5 look-alikes.')
  })

  it('claims no columns leave a blocked run', () => {
    expect(runViews({ ...run, status: 'block' } as RunOut, evidence).caption).not.toContain('leave')
  })
})
