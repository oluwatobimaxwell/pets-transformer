import type { ReactNode } from 'react'
import { Box, Circle, HStack, Stack, Text } from '@chakra-ui/react'
import { statusWord } from '../utils/status-words'
import { VERDICT_TEXT } from '../utils/verdict-text'

/**
 * The gate's decision, first and largest, in its status colour with an icon and words, never colour alone.
 * A release also gets the "Sealed" stamp, the same moment the 3D model's cage locks. Children add detail under the message.
 */
export function VerdictBanner({ status, children }: { status: string; children?: ReactNode }) {
  const verdict = VERDICT_TEXT[status]
  if (!verdict) return null
  const word = statusWord(status)
  const StatusIcon = word.icon
  return (
    <HStack role="status" gap="4" colorPalette={word.palette} bg="colorPalette.subtle" borderWidth="1px" borderColor="colorPalette.muted"
      rounded="l3" p={{ base: '4', md: '5' }} align={children ? 'start' : 'center'} animation="rise 300ms var(--chakra-easings-out)" position="relative">
      <Circle size="12" bg="colorPalette.solid" color="colorPalette.contrast" flexShrink="0"
        animation="pop 500ms var(--chakra-easings-spring) 150ms backwards">
        <StatusIcon size={22} aria-hidden="true" />
      </Circle>
      <Stack gap="0.5" flex="1" minW="0">
        <Text fontWeight="bold" textStyle="xl" letterSpacing="-0.02em" color="colorPalette.fg">{word.label}</Text>
        <Text textStyle="sm" color="fg">{verdict.message}</Text>
        {children}
      </Stack>
      {status === 'release' && (
        <Box hideBelow="sm" flexShrink="0" borderWidth="2px" borderColor="brand.solid" color="brand.fg" bg="bg.panel" rounded="l2" px="3" py="2"
          fontFamily="mono" fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em" textAlign="center"
          transform="rotate(-5deg)" animation="stamp 600ms var(--chakra-easings-out) 300ms backwards" aria-hidden="true">
          Sealed
          <Text as="span" display="block" textTransform="none" letterSpacing="0" fontWeight="medium">by the gate</Text>
        </Box>
      )}
    </HStack>
  )
}
