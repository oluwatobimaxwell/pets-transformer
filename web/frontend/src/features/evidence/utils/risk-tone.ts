/** How bad a risk share is, in the engine's tones: none found, low (under 5%) or high. */
export function riskTone(value: number | null | undefined): { tone: 'good' | 'warn' | 'bad'; word: string } {
  if (!value) return { tone: 'good', word: 'None found' }
  return value < 0.05 ? { tone: 'warn', word: 'Low' } : { tone: 'bad', word: 'High' }
}
