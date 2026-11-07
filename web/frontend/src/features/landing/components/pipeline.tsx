import { Box, Circle, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { STAGES } from '../content'

/**
 * The six stages as one connected line rather than a grid of cards, with a pulse travelling along it, because they
 * run in this order on every release.
 */
export function Pipeline() {
  return (
    <Box position="relative">
      <Box aria-hidden="true" position="absolute" top="6" insetX="6" h="2px" bg="border" hideBelow="lg" overflow="hidden">
        <Box h="full" w="full" position="relative" animation="travel 6s cubic-bezier(0.45, 0, 0.55, 1) infinite">
          <Box position="absolute" right="0" h="full" w="20" rounded="full" bgGradient="to-r" gradientFrom="transparent" gradientTo="accent.solid" />
        </Box>
      </Box>
      <Flex as="ol" listStyleType="none" direction={{ base: 'column', lg: 'row' }} gap={{ base: '6', lg: '4' }} position="relative">
        {STAGES.map((stage, index) => {
          const StageIcon = stage.icon
          return (
            <Flex as="li" key={stage.name} flex="1" gap="4" direction={{ base: 'row', lg: 'column' }} colorPalette={stage.palette}>
              <Circle size="12" bg="bg" borderWidth="1.5px" borderColor="colorPalette.solid" color="colorPalette.fg" flexShrink="0" position="relative">
                <StageIcon size={20} aria-hidden="true" />
              </Circle>
              <Stack gap="1.5" pe={{ lg: '2' }}>
                <Heading as="h3" fontSize="lg">
                  <Text as="span" fontFamily="mono" fontSize="sm" color="fg.subtle" me="2">{index + 1}</Text>{stage.name}
                </Heading>
                <Text fontSize="sm" color="fg.muted" lineHeight="1.55">{stage.text}</Text>
              </Stack>
            </Flex>
          )
        })}
      </Flex>
    </Box>
  )
}
