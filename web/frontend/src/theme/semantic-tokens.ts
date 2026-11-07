import { defineSemanticTokens } from '@chakra-ui/react'

/**
 * Semantic tokens: what components reference. Every colour has a light and a dark value, so colour mode switching is free.
 * Restrained palette: tinted neutrals carry the surface, and the ink accent marks actions, the current step and selection only.
 */
export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      DEFAULT: { value: { _light: '{colors.gray.50}', _dark: 'oklch(0.165 0.01 262)' } },
      subtle: { value: { _light: '{colors.gray.100}', _dark: '{colors.gray.950}' } },
      muted: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.900}' } },
      emphasized: { value: { _light: '{colors.gray.300}', _dark: '{colors.gray.800}' } },
      panel: { value: { _light: '{colors.white}', _dark: 'oklch(0.2 0.011 262)' } },
    },
    fg: {
      DEFAULT: { value: { _light: 'oklch(0.21 0.015 262)', _dark: 'oklch(0.95 0.005 262)' } },
      muted: { value: { _light: 'oklch(0.44 0.016 262)', _dark: 'oklch(0.76 0.012 262)' } },
      subtle: { value: { _light: 'oklch(0.47 0.014 262)', _dark: 'oklch(0.66 0.012 262)' } },
    },
    border: {
      DEFAULT: { value: { _light: 'oklch(0.9 0.007 262)', _dark: 'oklch(0.29 0.013 262)' } },
      muted: { value: { _light: 'oklch(0.93 0.006 262)', _dark: 'oklch(0.25 0.012 262)' } },
      subtle: { value: { _light: 'oklch(0.955 0.005 262)', _dark: 'oklch(0.22 0.011 262)' } },
      emphasized: { value: { _light: 'oklch(0.83 0.01 262)', _dark: 'oklch(0.38 0.014 262)' } },
    },
    brand: {
      solid: { value: { _light: '{colors.ink.700}', _dark: '{colors.ink.400}' } },
      contrast: { value: { _light: '{colors.white}', _dark: '{colors.ink.950}' } },
      fg: { value: { _light: '{colors.ink.700}', _dark: '{colors.ink.300}' } },
      subtle: { value: { _light: '{colors.ink.50}', _dark: 'oklch(0.25 0.045 262)' } },
      muted: { value: { _light: '{colors.ink.100}', _dark: 'oklch(0.3 0.065 262)' } },
      emphasized: { value: { _light: '{colors.ink.200}', _dark: '{colors.ink.800}' } },
      focusRing: { value: { _light: '{colors.ink.500}', _dark: '{colors.ink.300}' } },
      border: { value: { _light: '{colors.ink.300}', _dark: '{colors.ink.700}' } },
    },
  },
  radii: {
    l1: { value: '4px' },
    l2: { value: '8px' },
    l3: { value: '12px' },
    control: { value: '8px' },
  },
  shadows: {
    /** Floating layers only (menus, the sticky header). Panels on the page use a border instead. */
    panel: {
      value: {
        _light: '0 1px 2px oklch(0.2 0.02 262 / 0.06), 0 4px 8px oklch(0.2 0.02 262 / 0.05)',
        _dark: '0 1px 2px oklch(0 0 0 / 0.45), 0 4px 8px oklch(0 0 0 / 0.35)',
      },
    },
  },
})
