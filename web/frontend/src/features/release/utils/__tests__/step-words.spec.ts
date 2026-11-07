import { STEP_TITLES } from '../../types'
import { STEP_WORDS, stepOfPath } from '../step-words'

describe('step pages', () => {
  it('gives every step its own page, in order', () => {
    expect(STEP_WORDS).toHaveLength(STEP_TITLES.length)
    expect(STEP_WORDS.map((step) => step.path)).toEqual(['/release/data', '/release/recipient', '/release/columns', '/release/run'])
  })

  it('finds the step a page shows, with or without a trailing slash', () => {
    expect(stepOfPath('/release/data')).toBe(0)
    expect(stepOfPath('/release/columns/')).toBe(2)
    expect(stepOfPath('/runs/abc')).toBe(-1)
    expect(stepOfPath('/')).toBe(-1)
  })
})
