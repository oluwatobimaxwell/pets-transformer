import type { ReactNode } from 'react'
import { HStack } from '@chakra-ui/react'
import { CHIP_TONES, type ChipTone } from '../utils/chip-tones'

/** A small rounded label on the deep stage. */
export function DemoChip({ children, tone = 'neutral' }: { children: ReactNode; tone?: ChipTone }) {
  const colors = CHIP_TONES[tone]
  return (
    <HStack as="span" gap="1.5" px="2.5" py="1" rounded="full" bg={colors.bg} color={colors.color} fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
      {children}
    </HStack>
  )
}
