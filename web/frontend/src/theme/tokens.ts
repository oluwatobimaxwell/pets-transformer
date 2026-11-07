import { defineTokens } from '@chakra-ui/react'

const sans = `'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif`
const mono = `'IBM Plex Mono', ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace`

/**
 * Raw design tokens. Two brand colours carry meaning, never decoration:
 * forest means handled (protected data, safe progress, the primary action), mandarin means it needs attention
 * (identifying data, records that stand out, the current step). Neutrals are warm sand in light mode and deep
 * green in dark mode. Components never use these directly; they go through the semantic tokens. See DESIGN.md.
 */
export const tokens = defineTokens({
  colors: {
    black: { value: '#10241E' },
    white: { value: '#FFFFFF' },
    // Neutral ramp: sand at the light end, deep green at the dark end, so both modes share one family
    gray: {
      50: { value: '#FBFAF6' },
      100: { value: '#F2EFE7' },
      200: { value: '#E8E3D8' },
      300: { value: '#DAD3C4' },
      400: { value: '#B4AE9F' },
      500: { value: '#7D857F' },
      600: { value: '#5E6864' },
      700: { value: '#33564D' },
      800: { value: '#22403A' },
      900: { value: '#132822' },
      950: { value: '#0A1713' },
    },
    forest: {
      50: { value: '#EEF7F2' },
      100: { value: '#E1F0E9' },
      200: { value: '#B5D9C9' },
      300: { value: '#8FD3B6' },
      400: { value: '#5DB894' },
      500: { value: '#2FA37F' },
      600: { value: '#1E7A61' },
      700: { value: '#015D47' },
      800: { value: '#01493A' },
      900: { value: '#003326' },
      950: { value: '#05231C' },
    },
    mandarin: {
      50: { value: '#FFF5EF' },
      100: { value: '#FFEADF' },
      200: { value: '#FBC3A6' },
      300: { value: '#FF9A66' },
      400: { value: '#FF7A3D' },
      500: { value: '#FD550A' },
      600: { value: '#C24103' },
      700: { value: '#B03A00' },
      800: { value: '#7A3A1A' },
      900: { value: '#3A1E10' },
      950: { value: '#26130A' },
    },
  },
  fonts: {
    heading: { value: sans },
    body: { value: sans },
    mono: { value: mono },
  },
  letterSpacings: {
    display: { value: '-0.022em' },
  },
  durations: {
    state: { value: '180ms' },
  },
  easings: {
    out: { value: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
    spring: { value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  },
})
