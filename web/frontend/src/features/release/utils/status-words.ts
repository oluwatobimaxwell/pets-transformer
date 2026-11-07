import { CircleAlert, CircleCheck, CircleX, Clock, LoaderCircle, OctagonX, type LucideIcon } from 'lucide-react'

/** What each run status means, its colour and its icon. */
const STATUS_WORDS: Record<string, { label: string; palette: string; finished: boolean; icon: LucideIcon }> = {
  queued: { label: 'Waiting', palette: 'gray', finished: false, icon: Clock },
  running: { label: 'Running', palette: 'blue', finished: false, icon: LoaderCircle },
  release: { label: 'Released', palette: 'green', finished: true, icon: CircleCheck },
  review: { label: "Held for a person's review", palette: 'orange', finished: true, icon: CircleAlert },
  block: { label: 'Blocked', palette: 'red', finished: true, icon: OctagonX },
  error: { label: 'Failed', palette: 'red', finished: true, icon: CircleX },
}

export function statusWord(status: string) {
  return STATUS_WORDS[status] ?? { label: status, palette: 'gray', finished: true, icon: Clock }
}
