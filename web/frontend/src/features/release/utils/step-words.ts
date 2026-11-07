import { Columns3, Database, ShieldCheck, UserRound, type LucideIcon } from 'lucide-react'
import { Path } from '@/router/paths'

/** The icon, one-line hint and page of each step of a release, in the order of STEP_TITLES. */
export const STEP_WORDS: { icon: LucideIcon; hint: string; path: Path }[] = [
  { icon: Database, hint: 'Upload or pick a dataset', path: Path.ReleaseData },
  { icon: UserRound, hint: 'Who receives it, and why', path: Path.ReleaseRecipient },
  { icon: Columns3, hint: 'Check what Detect found', path: Path.ReleaseColumns },
  { icon: ShieldCheck, hint: 'Run the release gate', path: Path.ReleaseRun },
]

/** Which step a page shows, or -1 for pages outside the four steps (history, a run). */
export function stepOfPath(pathname: string): number {
  const clean = pathname.replace(/\/+$/, '')
  return STEP_WORDS.findIndex((step) => step.path === clean)
}
