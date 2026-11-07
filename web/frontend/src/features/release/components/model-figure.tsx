import { Box, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { CoreModel } from '@/shared/components/core-model'
import type { DataView } from '../utils/studio-view'
import type { DataSide } from '../utils/data-sides'
import { DataSideSwitch } from './data-side-switch'

interface ModelFigureProps {
  view: DataView
  /** Present when the run has both states to compare. */
  side?: DataSide
  onSide?: (side: DataSide) => void
}

/** The 3D model of the data, what it shows in one sentence and its legend, with the Original and Protected switch on a run. */
export function ModelFigure({ view, side, onSide }: ModelFigureProps) {
  return (
    <Box as="figure" m="0" flexShrink="0" rounded="l3" borderWidth="1px" borderColor="deep.line" overflow="hidden" bgGradient="to-b" gradientFrom="deep.raised" gradientTo="deep"
      position="relative">
      {side && onSide && (
        <HStack position="absolute" top="2.5" insetX="2.5" justify="space-between" zIndex="1">
          <Text textStyle="xs" fontWeight="semibold" color="deep.muted" letterSpacing="0.06em" textTransform="uppercase">The data</Text>
          <DataSideSwitch side={side} onChange={onSide} />
        </HStack>
      )}
      <CoreModel scene={view.scene} label={view.caption} />
      <Stack as="figcaption" gap="2" px="3.5" py="3" borderTopWidth="1px" borderColor="deep.line">
        <Text textStyle="sm" lineHeight="1.45" minH="2.9em" aria-live="polite">{view.caption}</Text>
        {view.legend.length > 0 && (
          <Flex as="ul" listStyleType="none" wrap="wrap" columnGap="3" rowGap="1" textStyle="xs" color="deep.muted">
            {view.legend.map((item) => (
              <HStack as="li" key={item.text} gap="1.5">
                <Box w="2" h="2" rounded="full" bg={item.color} flexShrink="0" aria-hidden="true" />
                {item.text}
              </HStack>
            ))}
          </Flex>
        )}
      </Stack>
    </Box>
  )
}
