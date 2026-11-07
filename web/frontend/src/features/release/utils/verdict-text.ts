/** What a finished run means for the person, by gate status. */
export const VERDICT_TEXT: Record<string, { status: 'success' | 'warning' | 'error'; message: string }> = {
  release: { status: 'success', message: 'Every check passed. The protected data is ready to share with this recipient.' },
  review: { status: 'warning', message: 'A person must decide before release. The dashboard lists what the gate is waiting on.' },
  block: { status: 'error', message: 'The gate refused to release this data. The dashboard explains which check failed.' },
}
