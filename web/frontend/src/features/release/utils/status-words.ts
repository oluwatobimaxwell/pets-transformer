import { CircleAlert, CircleCheck, CircleX, Clock, LoaderCircle, OctagonX, type LucideIcon } from 'lucide-react'

/**
 * What each run status means, its colour and its icon. Released is forest, the colour of protected data.
 * `deep` is the same colour for the dark rail, where the palettes' solid shades are too dark to read.
 */
const STATUS_WORDS: Record<string, { label: string; palette: string; deep: string; finished: boolean; icon: LucideIcon }> = {
  queued: { label: 'Waiting', palette: 'gray', deep: '#A3C2B7', finished: false, icon: Clock },
  running: { label: 'Running', palette: 'blue', deep: '#8DB8DF', finished: false, icon: LoaderCircle },
  release: { label: 'Released', palette: 'brand', deep: '#8FD3B6', finished: true, icon: CircleCheck },
  review: { label: "Held for a person's review", palette: 'orange', deep: '#F2B544', finished: true, icon: CircleAlert },
  block: { label: 'Blocked', palette: 'red', deep: '#FD550A', finished: true, icon: OctagonX },
  error: { label: 'Failed', palette: 'red', deep: '#FD550A', finished: true, icon: CircleX },
}

export function statusWord(status: string) {
  return STATUS_WORDS[status] ?? { label: status, palette: 'gray', deep: '#A3C2B7', finished: true, icon: Clock }
}
