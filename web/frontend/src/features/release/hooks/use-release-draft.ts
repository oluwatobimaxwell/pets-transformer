import { useEffect, useState } from 'react'
import type { ColumnOut, CustomScenarioIn, DatasetOut, QuestionIn } from '@/api/generated'
import type { ReleaseDraft } from '../types'
import { emptyQuestion } from '../utils/empty-question'

const EMPTY_CUSTOM: CustomScenarioIn = { recipient: '', purpose: '', trust_level: 'contractual', k: 5, questions: [] }
const EMPTY_DRAFT: ReleaseDraft = { dataset: null, scenarioId: null, custom: EMPTY_CUSTOM, decisions: {} }

/** The draft survives a page refresh in this tab only. It holds choices and column names, never the data itself. */
const STORAGE_KEY = 'pets-release-draft'

function storedDraft(): ReleaseDraft {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_DRAFT
    const parsed = JSON.parse(raw) as Partial<ReleaseDraft>
    return { ...EMPTY_DRAFT, ...parsed, custom: { ...EMPTY_CUSTOM, ...parsed.custom } }
  } catch {
    return EMPTY_DRAFT
  }
}

/** Owns everything the person chooses on the way to a run. Each step is its own page; this state is shared by all four. */
export function useReleaseDraft() {
  const [draft, setDraft] = useState<ReleaseDraft>(storedDraft)

  useEffect(() => {
    try {
      if (draft.dataset) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
      else sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // Storage blocked: the draft still works, it just won't survive a refresh
    }
  }, [draft])

  const chooseDataset = (dataset: DatasetOut) => setDraft({ ...EMPTY_DRAFT, dataset })
  const chooseScenario = (scenarioId: string | null) => setDraft((d) => ({ ...d, scenarioId }))
  const updateCustom = (changes: Partial<CustomScenarioIn>) => setDraft((d) => ({ ...d, custom: { ...d.custom, ...changes } }))
  const questions = draft.custom.questions ?? []
  const setQuestions = (next: QuestionIn[]) => updateCustom({ questions: next })
  const addQuestion = () => setQuestions([...questions, emptyQuestion()])
  const changeQuestion = (index: number, question: QuestionIn) => setQuestions(questions.map((q, i) => (i === index ? question : q)))
  const removeQuestion = (index: number) => setQuestions(questions.filter((_, i) => i !== index))
  const decide = (column: ColumnOut, role: string, subtype: string) =>
    setDraft((d) => ({ ...d, decisions: { ...d.decisions, [column.key]: { role, subtype, reason: 'Decided by a person in the web app' } } }))
  const reset = () => setDraft(EMPTY_DRAFT)

  /** Each step's own answer must be given before the next opens. */
  const ready = [Boolean(draft.dataset), Boolean(draft.scenarioId || draft.custom.recipient.trim()), true, true]
  const reachable = ready.findIndex((done) => !done) === -1 ? ready.length - 1 : ready.findIndex((done) => !done)

  return { draft, ready, reachable, chooseDataset, chooseScenario, updateCustom, addQuestion, changeQuestion, removeQuestion, decide, reset }
}

export type ReleaseDraftApi = ReturnType<typeof useReleaseDraft>
