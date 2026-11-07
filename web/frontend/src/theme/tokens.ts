import { defineTokens } from '@chakra-ui/react'

const sans = `'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif`
const mono = `'IBM Plex Mono', ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace`

/**
 * Raw design tokens. Neutrals lean very slightly toward the ink accent (hue 262) so surfaces and accent belong together.
 * Components never use these directly; they go through the semantic tokens.
 */
export const tokens = defineTokens({
  colors: {
    black: { value: 'oklch(0.17 0.012 262)' },
    white: { value: 'oklch(1 0 0)' },
    gray: {
      50: { value: 'oklch(0.985 0.003 262)' },
      100: { value: 'oklch(0.965 0.005 262)' },
      200: { value: 'oklch(0.93 0.007 262)' },
      300: { value: 'oklch(0.88 0.009 262)' },
      400: { value: 'oklch(0.74 0.012 262)' },
      500: { value: 'oklch(0.6 0.014 262)' },
      600: { value: 'oklch(0.48 0.016 262)' },
      700: { value: 'oklch(0.38 0.016 262)' },
      800: { value: 'oklch(0.29 0.014 262)' },
      900: { value: 'oklch(0.23 0.012 262)' },
      950: { value: 'oklch(0.19 0.01 262)' },
    },
    ink: {
      50: { value: 'oklch(0.97 0.015 262)' },
      100: { value: 'oklch(0.93 0.035 262)' },
      200: { value: 'oklch(0.87 0.06 262)' },
      300: { value: 'oklch(0.78 0.1 262)' },
      400: { value: 'oklch(0.7 0.13 262)' },
      500: { value: 'oklch(0.58 0.16 262)' },
      600: { value: 'oklch(0.49 0.16 262)' },
      700: { value: 'oklch(0.42 0.14 262)' },
      800: { value: 'oklch(0.34 0.11 262)' },
      900: { value: 'oklch(0.27 0.08 262)' },
      950: { value: 'oklch(0.22 0.06 262)' },
    },
  },
  fonts: {
    heading: { value: sans },
    body: { value: sans },
    mono: { value: mono },
  },
  letterSpacings: {
    display: { value: '-0.02em' },
  },
  durations: {
    state: { value: '180ms' },
  },
  easings: {
    out: { value: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  },
})
