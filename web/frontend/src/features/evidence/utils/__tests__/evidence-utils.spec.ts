import type { FieldEvidenceOut, GateAttemptOut, HeadlineTileOut } from '@/api/generated'
import { fieldCounts, filterFields } from '../field-filters'
import { gateSummary, orderChecks } from '../gate-checks'
import { headlineMeter, headlineValue } from '../headline-value'
import { isToken, queryRows, textParts } from '../record-rows'
import { riskTone } from '../risk-tone'
import { formatRisk, formatShare } from '../share-format'

const tile = (format: string, value: number, total?: number) => ({ label: 'x', meaning: '', format, value, total }) as HeadlineTileOut

describe('headline figures', () => {
  it('writes each format the way a reader expects', () => {
    expect(headlineValue(tile('score', 0.992))).toEqual({ main: '0.99' })
    expect(headlineValue(tile('percent', 1))).toEqual({ main: '100.0%' })
    expect(headlineValue(tile('count', 254, 254))).toEqual({ main: '254', suffix: 'of 254' })
    expect(headlineValue(tile('epsilon', 1))).toEqual({ prefix: 'ε', main: '1' })
  })

  it('gives a meter to shares and counts, never to a budget', () => {
    expect(headlineMeter(tile('count', 1, 2))).toBe(0.5)
    expect(headlineMeter(tile('epsilon', 1))).toBeNull()
  })
})

describe('risks', () => {
  it('never lets a small risk read as none', () => {
    expect(formatRisk(0)).toBe('0')
    expect(formatRisk(0.0004)).toBe('<0.001')
    expect(formatShare(0.2495)).toBe('24.9%')
    expect(formatShare(0.0004)).toBe('<0.1%')
    expect(riskTone(0).word).toBe('None found')
    expect(riskTone(0.01).tone).toBe('warn')
    expect(riskTone(0.3).tone).toBe('bad')
  })
})

describe('gate checks', () => {
  const attempt = {
    attempt: 1, status: 'block', checks: [
      { name: 'A', passed: true, severity: 'block', detail: '' },
      { name: 'B', passed: true, severity: 'info', detail: '' },
      { name: 'C', passed: false, severity: 'block', detail: '' },
    ],
  } as GateAttemptOut

  it('counts passes, failures and notes, and puts failures first', () => {
    const summary = gateSummary(attempt)
    expect([summary.passed.length, summary.failed.length, summary.notes.length]).toEqual([1, 1, 1])
    expect(orderChecks(attempt.checks).map((check) => check.name)).toEqual(['C', 'B', 'A'])
  })
})

describe('columns', () => {
  const fields = [
    { field: 't.name', role: 'direct_identifier', pet: 'remove', why: 'no task uses it', needs_review: false },
    { field: 't.age', role: 'quasi_identifier', pet: 'generalise', why: 'clue', needs_review: true },
  ] as FieldEvidenceOut[]

  it('filters by what happened to the column and by search text', () => {
    expect(fieldCounts(fields)).toEqual({ kept: 1, removed: 1, review: 1, all: 2 })
    expect(filterFields(fields, 'all', 'AGE').map((field) => field.field)).toEqual(['t.age'])
    expect(filterFields(fields, 'removed', '')).toHaveLength(1)
  })
})

describe('released rows', () => {
  const rows = [['pt0123456789abcdef', '20-29', 10], ['pt1111111111111111', '0-9', 2], ['pt0123456789abcdef', '30-39', 7]]

  it('knows a pseudonym and marks redaction placeholders', () => {
    expect(isToken('pt0123456789abcdef')).toBe(true)
    expect(isToken('Turku')).toBe(false)
    expect(textParts('Called [NAME_1] at home')).toEqual([
      { text: 'Called ', placeholder: false }, { text: '[NAME_1]', placeholder: true }, { text: ' at home', placeholder: false },
    ])
  })

  it('follows a pseudonym, searches and sorts numbers as numbers', () => {
    expect(queryRows(rows, { query: '', token: 'pt0123456789abcdef', sort: -1, direction: 1 })).toHaveLength(2)
    expect(queryRows(rows, { query: '0-9', token: '', sort: -1, direction: 1 })).toHaveLength(1)
    expect(queryRows(rows, { query: '', token: '', sort: 2, direction: -1 }).map((row) => row[2])).toEqual([10, 7, 2])
  })
})
