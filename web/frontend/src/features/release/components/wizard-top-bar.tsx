import { Link } from 'react-router-dom'
import { Box, Button, HStack, Text } from '@chakra-ui/react'
import { X } from 'lucide-react'
import { Path } from '@/router/paths'
import { BrandMark } from '@/shared/components/brand-mark'
import { ColorModeButton } from '@/shared/components/ui/color-mode-button'
import { STEP_TITLES } from '../types'
import { DataHandlingButton } from './data-handling-button'

/** The wizard's one bar: where you are, how far along, and a way out. The thin line under it fills step by step. */
export function WizardTopBar({ step }: { step: number }) {
  const running = step < 0
  const progress = running ? 1 : (step + 1) / (STEP_TITLES.length + 1)
  return (
    <Box as="header" position="sticky" top="0" zIndex="sticky" bg="bg" borderBottomWidth="1px" borderColor="border">
      <HStack gap="3" px={{ base: '4', md: '6' }} h="16">
        <BrandMark />
        <Text fontWeight="semibold">New release</Text>
        <Text textStyle="sm" color="fg.muted" hideBelow="sm" fontVariantNumeric="tabular-nums">
          {running ? 'The release gate' : `Step ${step + 1} of ${STEP_TITLES.length} · ${STEP_TITLES[step]}`}
        </Text>
        <HStack gap="1" ms="auto">
          <DataHandlingButton />
          <ColorModeButton />
          <Button asChild variant="outline" size="sm">
            <Link to={Path.Runs} aria-label="Close the wizard and go to runs and results">
              <X aria-hidden="true" />
              <Text as="span" hideBelow="sm">Close</Text>
            </Link>
          </Button>
        </HStack>
      </HStack>
      <Box h="3px" bg="bg.muted" aria-hidden="true">
        <Box h="full" bg={running ? 'brand.solid' : 'accent.solid'} w={`${progress * 100}%`} transition="width 500ms cubic-bezier(0.2, 0.8, 0.2, 1), background 300ms" />
      </Box>
    </Box>
  )
}
