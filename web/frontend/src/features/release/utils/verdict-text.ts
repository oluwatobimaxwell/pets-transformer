/** What a finished run means for the person, by gate status. */
export const VERDICT_TEXT: Record<string, { message: string }> = {
  release: { message: 'Every check passed. The protected data is ready to share with this recipient.' },
  review: { message: 'A person must decide before release. The evidence shows what the gate is waiting on.' },
  block: { message: 'The gate refused to release this data. The evidence shows which check failed.' },
}
