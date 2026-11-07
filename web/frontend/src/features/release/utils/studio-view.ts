import type { RunOut } from '@/api/generated'
import { CORE_COLORS, IDLE_SCENE, type CoreScene } from '@/shared/components/core-model'
import { statusWord } from './status-words'

/** One live figure beside the 3D model. Numbers count between values, so the format is a key, not a function. */
export interface Readout {
  label: string
  value: number | null
  format: 'int' | 'score' | 'percent'
  note?: string
  /** hot: needs attention (mandarin). cool: handled (forest). */
  tone?: 'hot' | 'cool'
}

export interface LegendItem {
  color: string
  text: string
}

/** One state of the data in the rail: the model's state, a sentence saying what it shows, a legend and two figures. */
export interface DataView {
  scene: CoreScene
  caption: string
  legend: LegendItem[]
  readouts: Readout[]
}

/** What the studio's rail shows. With `original`, the rail can switch between the data as it came in and as the gate left it. */
export interface StudioView extends DataView {
  original?: DataView
}

/** The group size drawn for protected rows. Visual only: the caption never claims a k the run didn't report. */
const DRAWN_GROUP = 5

export const EMPTY_VIEW: StudioView = {
  scene: IDLE_SCENE,
  caption: 'Choose data and its model assembles here.',
  legend: [],
  readouts: [],
}

interface RunSummary {
  scores?: { privacy?: number; utility?: number } | null
  rows?: { kept?: number; total?: number }
  answers?: { epsilon: number; answered: number; questions: number } | null
}

/**
 * The model for a run. While the gate works it scans; then it shows the decision:
 * released rows are drawn into groups and sealed in a locked cage, a release held for review gets the cage without the
 * lock, a blocked release leaves records standing out, and a public release dissolves the rows into answers only.
 * The share drawn standing out is 1 − the privacy score, and the caption says so.
 */
export function runView(run: RunOut): StudioView {
  const word = statusWord(run.status)
  const summary = run.summary as RunSummary
  const privacy = summary.scores?.privacy
  const utility = summary.scores?.utility
  const answers = summary.answers
  const risk = typeof privacy === 'number' ? Math.max(0, Math.min(1, 1 - privacy)) : null

  if (!word.finished) {
    const last = run.events[run.events.length - 1]
    return {
      scene: { ...IDLE_SCENE, mode: 'data', busy: true },
      caption: last ? `The gate is working: ${last.message}` : 'The gate is starting.',
      legend: [],
      readouts: [
        { label: 'Stages logged', value: run.events.length, format: 'int' },
        { label: 'Status', value: null, format: 'int', note: word.label },
      ],
    }
  }

  if (run.status === 'error') {
    return { scene: IDLE_SCENE, caption: 'The run failed, so nothing was released.', legend: [], readouts: [] }
  }

  const seal = run.status === 'release' ? 2 : run.status === 'review' ? 1 : 0

  if (answers) {
    return {
      scene: { ...IDLE_SCENE, mode: 'answers', seal: run.status === 'block' ? 0 : seal },
      caption: run.status === 'block'
        ? 'Blocked. No rows and no answers leave.'
        : `No rows leave. The recipient gets ${answers.answered} noisy answers, protected with differential privacy at ε ${answers.epsilon}.`,
      legend: [{ color: CORE_COLORS.answers, text: 'Answers only, no rows' }],
      readouts: [
        { label: 'Answers', value: answers.answered, format: 'int', note: `of ${answers.questions}` },
        { label: 'Usefulness', value: utility ?? null, format: 'score', tone: 'cool' },
      ],
    }
  }

  const exposed = risk ?? (run.status === 'block' ? 0.35 : 0)
  const readouts: Readout[] = [
    { label: 'Privacy', value: privacy ?? null, format: 'score', note: 'out of 1.00', tone: risk && risk > 0.2 ? 'hot' : 'cool' },
    { label: 'Usefulness', value: utility ?? null, format: 'score', note: 'out of 1.00', tone: 'cool' },
  ]
  const legend: LegendItem[] = [
    { color: CORE_COLORS.protect, text: 'Protected' },
    ...(exposed > 0 ? [{ color: CORE_COLORS.exposed, text: 'Remaining risk (1 − privacy)' }] : []),
  ]

  if (run.status === 'block') {
    return {
      scene: { ...IDLE_SCENE, mode: 'exposed', exposed },
      caption: 'Blocked. Some checks still fail, so nothing was released.',
      legend: [{ color: CORE_COLORS.neutral, text: 'Records' }, { color: CORE_COLORS.exposed, text: 'Remaining risk' }],
      readouts,
    }
  }
  return {
    scene: { ...IDLE_SCENE, mode: 'grouped', k: DRAWN_GROUP, exposed, protect: true, seal },
    caption: run.status === 'release'
      ? 'Released. Every check passed and the release is sealed.'
      : "Protected, and held until a person reviews it. The cage locks when it's released.",
    legend,
    readouts,
  }
}
