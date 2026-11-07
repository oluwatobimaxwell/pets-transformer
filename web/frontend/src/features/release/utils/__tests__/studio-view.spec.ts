import type { RunOut } from '@/api/generated'
import { runView } from '../studio-view'

function run(status: string, summary: RunOut['summary'] = {}): RunOut {
  return { id: 'r1', dataset_id: 'ds1', scenario_id: 'HEALTH-S1', status, events: [{ at: '2026-11-07T10:00:00', stage: 'start', message: 'Started' }], summary }
}

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
