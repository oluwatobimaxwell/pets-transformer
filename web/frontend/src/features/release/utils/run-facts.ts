import type { RunOut } from '@/api/generated'

/** When a run started, as written in its first event, and its usefulness score once it has one. */
export function runFacts(run: RunOut) {
  const started = run.events[0]?.at ?? ''
  const scores = (run.summary as { scores?: { utility?: number } | null }).scores
  return { started: started ? `${started.slice(0, 10)} ${started.slice(11, 16)}` : '', utility: typeof scores?.utility === 'number' ? scores.utility : null }
}
