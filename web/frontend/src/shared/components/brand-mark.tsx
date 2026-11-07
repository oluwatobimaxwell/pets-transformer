import { Box, type BoxProps } from '@chakra-ui/react'

/**
 * The PETs Transformer mark, the same drawing as the favicon: a dataset as an isometric cube on the deep surface.
 * The left face carries a mandarin keyhole (privacy), the right face three forest rows (the records it keeps useful).
 */
export function BrandMark(props: BoxProps) {
  return (
    <Box boxSize="8" flexShrink="0" aria-hidden="true" {...props}>
      <svg viewBox="0 0 32 32" width="100%" height="100%" focusable="false">
        <rect width="32" height="32" rx="8" fill="#05231C" />
        <path d="M16 5 26 10.5v11L16 27 6 21.5v-11Z" fill="#0A3329" stroke="#8FD3B6" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M16 5 26 10.5 16 16 6 10.5Z" fill="#0F3D31" />
        <path d="M6 10.5 16 16l10-5.5M16 16v11" fill="none" stroke="#8FD3B6" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="m18.2 18.3 5.6-3.1m-5.6 5.9 5.6-3.1m-5.6 5.9 5.6-3.1" stroke="#8FD3B6" strokeWidth="1.3" strokeLinecap="round" opacity=".85" />
        <circle cx="11" cy="17.2" r="1.9" fill="#FD550A" />
        <path d="M10.15 18.4h1.7l.55 3.4h-2.8Z" fill="#FD550A" />
      </svg>
    </Box>
  )
}
