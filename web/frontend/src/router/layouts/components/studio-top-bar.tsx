import { Link } from 'react-router-dom'
import { useIsMutating } from '@tanstack/react-query'
import { Box, Button, HStack, Text } from '@chakra-ui/react'
import { Plus, RotateCcw } from 'lucide-react'
import { Path } from '@/router/paths'
import { BrandMark } from '@/shared/components/brand-mark'
import { CubeSpinner } from '@/shared/components/motion/cube-spinner'
import { ColorModeButton } from '@/shared/components/ui/color-mode-button'
import { DataHandlingButton, recipientName, useDraft, useStartOver, useStudioView } from '@/features/release'

/** The studio's top bar: the dataset and recipient, a busy pill, and the ways to start again. */
export function StudioTopBar() {
  const { draft } = useDraft()
  const view = useStudioView()
  const startOver = useStartOver()
  const mutating = useIsMutating()
  const busy = mutating > 0 || view.scene.busy
  const recipient = recipientName(draft)

  return (
    <HStack as="header" gap="3" px={{ base: '4', md: '8' }} minH="16" borderBottomWidth="1px" borderColor="border" bg="bg"
      position="sticky" top="0" zIndex="sticky">
      <Box hideFrom="lg" asChild>
        <Link to={Path.Home} aria-label="PETs Transformer home"><BrandMark /></Link>
      </Box>
      <HStack flex="1" minW="0" gap="2" textStyle="sm" color="fg.muted" fontVariantNumeric="tabular-nums">
        {draft.dataset ? (
          <>
            <Text hideBelow="sm">Dataset</Text>
            <Text color="fg" fontWeight="semibold" fontFamily="mono" truncate maxW="48">{draft.dataset.name}</Text>
            {recipient && (
              <>
                <Text color="fg.subtle" aria-hidden="true" hideBelow="sm">/</Text>
                <Text hideBelow="sm">for</Text>
                <Text color="fg" fontWeight="semibold" truncate maxW="56" hideBelow="sm">{recipient}</Text>
              </>
            )}
          </>
        ) : (
          <Text hideBelow="sm">No dataset chosen</Text>
        )}
      </HStack>
      {busy && (
        <HStack role="status" gap="2" colorPalette="brand" bg="colorPalette.subtle" color="colorPalette.fg" borderWidth="1px" borderColor="colorPalette.border"
          rounded="full" px="3" py="1" textStyle="xs" fontFamily="mono" animation="rise 300ms var(--chakra-easings-out)" flexShrink="0">
          <CubeSpinner />
          Working
        </HStack>
      )}
      <HStack gap="1" flexShrink="0">
        {draft.dataset && (
          <Button variant="ghost" size="sm" onClick={startOver} aria-label="Start over with new data">
            <RotateCcw aria-hidden="true" />
            <Text as="span" hideBelow="md">Start over</Text>
          </Button>
        )}
        <DataHandlingButton />
        <Button asChild variant="outline" size="sm">
          <Link to={Path.ReleaseData} aria-label="New release">
            <Plus aria-hidden="true" />
            <Text as="span" hideBelow="sm">New release</Text>
          </Link>
        </Button>
        <ColorModeButton />
      </HStack>
    </HStack>
  )
}
