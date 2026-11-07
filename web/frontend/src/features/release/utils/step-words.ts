import { Columns3, Database, ShieldCheck, UserRound, type LucideIcon } from 'lucide-react'

/** The icon and one-line hint for each step of a release, in the order of STEP_TITLES. */
export const STEP_WORDS: { icon: LucideIcon; hint: string }[] = [
  { icon: Database, hint: 'Upload or pick a dataset' },
  { icon: UserRound, hint: 'Who receives it, and why' },
  { icon: Columns3, hint: 'Check what Detect found' },
  { icon: ShieldCheck, hint: 'Run the release gate' },
]
