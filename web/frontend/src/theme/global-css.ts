import { defineGlobalStyles } from '@chakra-ui/react'

/** Keyframes, font smoothing and the reduced-motion rule live in motion.css and studio.css, which plain CSS expresses more simply. */
export const globalCss = defineGlobalStyles({
  html: {
    colorPalette: 'brand',
    textRendering: 'optimizeLegibility',
  },
  body: {
    bg: 'bg',
    color: 'fg',
    minH: '100dvh',
  },
  'h1, h2, h3': { textWrap: 'balance' },
  p: { textWrap: 'pretty' },
  '*::selection': { bg: 'accent.solid', color: 'accent.contrast' },
  // Every focusable element, including the card buttons, shows a clear mandarin ring for keyboard users
  ':focus-visible': { outline: '2px solid', outlineColor: 'brand.focusRing', outlineOffset: '2px' },
})
