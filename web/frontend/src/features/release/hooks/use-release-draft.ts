import { useState } from 'react'
import type { ColumnOut, CustomScenarioIn, DatasetOut, QuestionIn } from '@/api/generated'
import type { ReleaseDraft } from '../types'
import { emptyQuestion } from '../utils/empty-question'

const EMPTY_CUSTOM: CustomScenarioIn = { recipient: '', purpose: '', trust_level: 'contractual', k: 5, questions: [] }

/** Owns everything the person chooses on the way to a run. */
export function useReleaseDraft() {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<ReleaseDraft>({ dataset: null, scenarioId: null, custom: EMPTY_CUSTOM, decisions: {} })

  const chooseDataset = (dataset: DatasetOut) => {
    setDraft({ dataset, scenarioId: null, custom: EMPTY_CUSTOM, decisions: {} })
    setStep(1)
  }
  const chooseScenario = (scenarioId: string | null) => setDraft((d) => ({ ...d, scenarioId }))
  const updateCustom = (changes: Partial<CustomScenarioIn>) => setDraft((d) => ({ ...d, custom: { ...d.custom, ...changes } }))
  const questions = draft.custom.questions ?? []
  const setQuestions = (next: QuestionIn[]) => updateCustom({ questions: next })
  const addQuestion = () => setQuestions([...questions, emptyQuestion()])
  const changeQuestion = (index: number, question: QuestionIn) => setQuestions(questions.map((q, i) => (i === index ? question : q)))
  const removeQuestion = (index: number) => setQuestions(questions.filter((_, i) => i !== index))
  const decide = (column: ColumnOut, role: string, subtype: string) =>
    setDraft((d) => ({ ...d, decisions: { ...d.decisions, [column.key]: { role, subtype, reason: 'Decided by a person in the web app' } } }))

  /** Each step's own answer must be given before the next opens. */
  const ready = [Boolean(draft.dataset), Boolean(draft.scenarioId || draft.custom.recipient.trim()), true, true]
  const reachable = ready.findIndex((done) => !done) === -1 ? ready.length - 1 : ready.findIndex((done) => !done)

  return { step, setStep, draft, ready, reachable, chooseDataset, chooseScenario, updateCustom, addQuestion, changeQuestion, removeQuestion, decide }
}

export type ReleaseDraftApi = ReturnType<typeof useReleaseDraft>
