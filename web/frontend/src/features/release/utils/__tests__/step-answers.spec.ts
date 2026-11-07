import type { ReleaseDraft } from '../../types'
import { stepAnswers } from '../step-answers'

const EMPTY = { dataset: null, scenarioId: null, custom: { recipient: '' }, decisions: {} } as unknown as ReleaseDraft
const DATASET = { id: 'd1', name: 'health', tables: [{}, {}, {}, {}] } as unknown as ReleaseDraft['dataset']

describe('step answers', () => {
  it('has nothing to show before any data is chosen', () => {
    expect(stepAnswers(EMPTY)).toEqual([null, null, null, null])
  })

  it('names the data, the recipient and the column decisions', () => {
    const answers = stepAnswers({ ...EMPTY, dataset: DATASET, scenarioId: 'HEALTH-S1', decisions: { 'a.b': {} } as unknown as ReleaseDraft['decisions'] })
    expect(answers[0]).toEqual({ text: 'health · 4 tables', mono: true })
    expect(answers[1]).toEqual({ text: 'HEALTH-S1', mono: true })
    expect(answers[2]).toEqual({ text: '1 decision of your own', mono: false })
    expect(answers[3]).toBeNull()
  })

  it("says Detect's labels stand when the person changed none, and shows a described recipient in plain text", () => {
    const answers = stepAnswers({ ...EMPTY, dataset: DATASET, custom: { recipient: ' Hospital analysts ' } as ReleaseDraft['custom'] })
    expect(answers[1]).toEqual({ text: 'Hospital analysts', mono: false })
    expect(answers[2]?.text).toBe("Detect's labels as they are")
  })
})
