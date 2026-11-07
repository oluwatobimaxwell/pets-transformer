/** Background and text for the demo's chips on the deep stage: plain, needs attention (mandarin), handled (forest). */
export const CHIP_TONES = {
  neutral: { bg: 'rgba(234,243,239,0.06)', color: 'deep.fg' },
  alert: { bg: 'rgba(253,85,10,0.14)', color: 'mandarin.300' },
  safe: { bg: 'rgba(143,211,182,0.12)', color: 'forest.300' },
} as const

export type ChipTone = keyof typeof CHIP_TONES
