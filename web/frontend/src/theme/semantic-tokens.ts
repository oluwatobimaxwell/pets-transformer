import { defineSemanticTokens } from '@chakra-ui/react'

/**
 * Semantic tokens: what components reference. Every colour has a light and a dark value, so colour mode switching is free.
 * Every text token clears WCAG 2.2 AA (4.5:1) on bg and bg.panel in its mode.
 *
 * - brand (forest): the primary action, done steps, protected data.
 * - accent (mandarin): the one thing that needs attention now: identifying data, the current step, records that stand out.
 * - deep: the rail, the landing hero and the 3D stage. Dark in both modes, so the model reads the same everywhere.
 */
export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      DEFAULT: { value: { _light: '#F2EFE7', _dark: '#0A1713' } },
      panel: { value: { _light: '#FBFAF6', _dark: '#0F201B' } },
      raised: { value: { _light: '#FFFFFF', _dark: '#132822' } },
      subtle: { value: { _light: '#ECE8DE', _dark: '#132822' } },
      muted: { value: { _light: '#E6E1D5', _dark: '#183029' } },
      emphasized: { value: { _light: '#DAD3C4', _dark: '#22403A' } },
    },
    fg: {
      DEFAULT: { value: { _light: '#10241E', _dark: '#E6F0EC' } },
      muted: { value: { _light: '#525F5A', _dark: '#A9BEB6' } },
      subtle: { value: { _light: '#5E6864', _dark: '#93A89F' } },
    },
    border: {
      DEFAULT: { value: { _light: '#E2DCCF', _dark: '#22403A' } },
      muted: { value: { _light: '#E9E4D9', _dark: '#1B352E' } },
      subtle: { value: { _light: '#EFEBE2', _dark: '#172D27' } },
      emphasized: { value: { _light: '#CCC4B3', _dark: '#33564D' } },
    },
    brand: {
      solid: { value: { _light: '{colors.forest.700}', _dark: '{colors.forest.300}' } },
      contrast: { value: { _light: '{colors.white}', _dark: '{colors.forest.950}' } },
      fg: { value: { _light: '{colors.forest.700}', _dark: '{colors.forest.300}' } },
      subtle: { value: { _light: '{colors.forest.100}', _dark: '#123A2F' } },
      muted: { value: { _light: '#C9E5D8', _dark: '#1A4A3D' } },
      emphasized: { value: { _light: '{colors.forest.200}', _dark: '#24574A' } },
      border: { value: { _light: '{colors.forest.200}', _dark: '#24574A' } },
      focusRing: { value: { _light: '{colors.mandarin.600}', _dark: '{colors.mandarin.500}' } },
      /** The visible bottom edge that makes a solid key look pressable. */
      edge: { value: { _light: '{colors.forest.900}', _dark: '#3E8A6E' } },
    },
    accent: {
      solid: { value: '{colors.mandarin.500}' },
      contrast: { value: '{colors.black}' },
      fg: { value: { _light: '{colors.mandarin.700}', _dark: '{colors.mandarin.300}' } },
      subtle: { value: { _light: '{colors.mandarin.100}', _dark: '{colors.mandarin.900}' } },
      muted: { value: { _light: '{colors.mandarin.200}', _dark: '#5A2A12' } },
      emphasized: { value: { _light: '{colors.mandarin.200}', _dark: '{colors.mandarin.800}' } },
      border: { value: { _light: '{colors.mandarin.200}', _dark: '{colors.mandarin.800}' } },
      focusRing: { value: { _light: '{colors.mandarin.600}', _dark: '{colors.mandarin.500}' } },
      edge: { value: '{colors.mandarin.600}' },
    },
    deep: {
      DEFAULT: { value: '#05231C' },
      raised: { value: '#0A3329' },
      line: { value: '#1D4A3E' },
      fg: { value: '#EAF3EF' },
      muted: { value: '#A3C2B7' },
    },
  },
  radii: {
    l1: { value: '6px' },
    l2: { value: '10px' },
    l3: { value: '18px' },
    control: { value: '12px' },
  },
  shadows: {
    /** Floating layers only (menus, drawers, the sticky bars). Panels on the page use a border instead. */
    panel: {
      value: {
        _light: '0 1px 2px rgba(16,36,30,0.06), 0 8px 24px -12px rgba(16,36,30,0.18)',
        _dark: '0 1px 2px rgba(0,0,0,0.45), 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
    },
    /** A key's resting bottom edge. Pressing it removes the edge and moves the key down by the same amount. */
    key: { value: { _light: '0 3px 0 #CCC4B3', _dark: '0 3px 0 #33564D' } },
  },
})
