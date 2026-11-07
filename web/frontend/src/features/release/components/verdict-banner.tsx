import { Circle, HStack, Stack, Text } from '@chakra-ui/react'
import { statusWord } from '../utils/status-words'
import { VERDICT_TEXT } from '../utils/verdict-text'

/** The gate's decision, first and largest, in its status colour with an icon and words, never colour alone. */
export function VerdictBanner({ status }: { status: string }) {
  const verdict = VERDICT_TEXT[status]
  if (!verdict) return null
  const word = statusWord(status)
  const StatusIcon = word.icon
  return (
    <HStack role="status" gap="4" colorPalette={word.palette} bg="colorPalette.subtle" borderWidth="1px" borderColor="colorPalette.muted"
      rounded="l3" p={{ base: '4', md: '5' }} align="center" animation="rise 220ms var(--chakra-easings-out)">
      <Circle size="11" bg="colorPalette.solid" color="colorPalette.contrast" flexShrink="0">
        <StatusIcon size={22} aria-hidden="true" />
      </Circle>
      <Stack gap="0.5">
        <Text fontWeight="semibold" textStyle="lg" color="colorPalette.fg">{word.label}</Text>
        <Text textStyle="sm" color="fg">{verdict.message}</Text>
      </Stack>
    </HStack>
  )
}
