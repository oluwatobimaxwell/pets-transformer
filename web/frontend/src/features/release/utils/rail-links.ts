import { History, Plus, type LucideIcon } from 'lucide-react'
import { Path } from '@/router/paths'

/** Where the studio's rail leads: every run, and a new release. `end` marks the link only on its own page. */
export const RAIL_LINKS: { to: Path; label: string; icon: LucideIcon; end: boolean }[] = [
  { to: Path.Runs, label: 'Runs and results', icon: History, end: true },
  { to: Path.ReleaseData, label: 'New release', icon: Plus, end: false },
]
