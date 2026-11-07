/** The engine words each score with a band and a tone; this is only how a tone is coloured here. */
const TONE_PALETTES: Record<string, string> = { good: 'green', warn: 'orange', bad: 'red' }

export function tonePalette(tone: string | undefined) {
  return TONE_PALETTES[tone ?? ''] ?? 'gray'
}
