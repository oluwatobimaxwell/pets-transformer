import { defineRecipe } from '@chakra-ui/react'

/**
 * Recipe overrides, merged into Chakra's defaults: only what changes the look is listed.
 * Every control shares one radius, one weight and one transition, so buttons, inputs and selects read as one family.
 */
export const recipes = {
  button: defineRecipe({
    base: {
      borderRadius: 'control',
      fontWeight: 'medium',
      transitionProperty: 'background, border-color, color, box-shadow, transform',
      transitionDuration: 'state',
      transitionTimingFunction: 'out',
      _active: { transform: 'translateY(1px)' },
    },
    variants: {
      variant: {
        outline: {
          bg: 'bg.panel',
          borderColor: 'border.emphasized',
          color: 'fg',
          _hover: { bg: 'bg.subtle', borderColor: 'fg.subtle' },
        },
        ghost: {
          color: 'fg.muted',
          _hover: { bg: 'bg.muted', color: 'fg' },
        },
      },
    },
  }),
  input: defineRecipe({
    base: { borderRadius: 'control', bg: 'bg.panel' },
    variants: {
      variant: {
        outline: {
          borderColor: 'border.emphasized',
          _hover: { borderColor: 'fg.subtle' },
        },
      },
    },
  }),
  textarea: defineRecipe({
    base: { borderRadius: 'control', bg: 'bg.panel', px: '3', py: '2' },
    variants: {
      variant: {
        outline: {
          borderColor: 'border.emphasized',
          _hover: { borderColor: 'fg.subtle' },
        },
      },
    },
  }),
  heading: defineRecipe({
    base: { letterSpacing: '-0.01em', fontWeight: 'semibold' },
  }),
  badge: defineRecipe({
    base: { borderRadius: 'full', fontWeight: 'medium', gap: '1' },
  }),
  code: defineRecipe({
    base: { fontFamily: 'mono' },
  }),
}
