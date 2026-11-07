/** What each run status means, and its colour. */
const STATUS_WORDS: Record<string, { label: string; palette: string; finished: boolean }> = {
  queued: { label: 'Waiting', palette: 'gray', finished: false },
  running: { label: 'Running', palette: 'blue', finished: false },
  release: { label: 'Released', palette: 'green', finished: true },
  review: { label: "Held for a person's review", palette: 'orange', finished: true },
  block: { label: 'Blocked', palette: 'red', finished: true },
  error: { label: 'Failed', palette: 'red', finished: true },
}

export function statusWord(status: string) {
  return STATUS_WORDS[status] ?? { label: status, palette: 'gray', finished: true }
}
