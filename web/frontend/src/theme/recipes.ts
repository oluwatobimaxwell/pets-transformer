import { defineRecipe } from '@chakra-ui/react'

/**
 * Recipe overrides, merged into Chakra's defaults: only what changes the look is listed.
 * Depth is physical: solid and outline buttons sit on a visible bottom edge and press down by that edge when clicked,
 * so a press reads as a press without relying on colour.
 */
export const recipes = {
  button: defineRecipe({
    base: {
      borderRadius: 'control',
      fontWeight: 'semibold',
      transitionProperty: 'background, border-color, color, box-shadow, transform',
      transitionDuration: 'state',
      transitionTimingFunction: 'out',
      _active: { transform: 'translateY(2px)', boxShadow: 'none' },
      _disabled: { boxShadow: 'none' },
    },
    variants: {
      variant: {
        solid: {
          boxShadow: '0 2px 0 {colors.colorPalette.edge}',
        },
        outline: {
          bg: 'bg.raised',
          borderColor: 'border.emphasized',
          color: 'fg',
          boxShadow: '0 2px 0 {colors.border.emphasized}',
          _hover: { bg: 'bg.raised', borderColor: 'fg' },
        },
        ghost: {
          color: 'fg.muted',
          _hover: { bg: 'bg.muted', color: 'fg' },
        },
      },
    },
  }),
  input: defineRecipe({
    base: { borderRadius: 'control', bg: 'bg.raised' },
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
    base: { borderRadius: 'control', bg: 'bg.raised', px: '3', py: '2' },
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
    base: { letterSpacing: '-0.02em', fontWeight: 'semibold' },
  }),
  badge: defineRecipe({
    base: { borderRadius: 'full', fontWeight: 'semibold', gap: '1' },
  }),
  code: defineRecipe({
    base: { fontFamily: 'mono' },
  }),
}
