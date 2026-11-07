import { Badge, Box, Grid, Stack, Text } from '@chakra-ui/react'
import type { GateCheckOut } from '@/api/generated'
import { CHECK_KINDS, checkKind, SEVERITY_WORDS } from '../utils/gate-checks'

/** One check: passed, failed or a note, with what it found. A failure says what it costs the release. */
export function CheckRow({ check }: { check: GateCheckOut }) {
  const kind = checkKind(check)
  const { icon: KindIcon, color, word } = CHECK_KINDS[kind]
  return (
    <Grid as="li" templateColumns="20px minmax(0, 1fr) auto" gap="3" px={{ base: '4', md: '5' }} py="3" alignItems="start"
      bg={kind === 'fail' ? 'red.subtle/40' : undefined}>
      <Box color={color} pt="0.5"><KindIcon size={16} aria-label={word} /></Box>
      <Stack gap="0.5" minW="0">
        <Text textStyle="sm" fontWeight="semibold">{check.name}</Text>
        <Text textStyle="sm" color="fg.muted">{check.detail}</Text>
      </Stack>
      {kind === 'fail' && <Badge colorPalette="red" variant="subtle" size="sm">{SEVERITY_WORDS[check.severity] ?? check.severity}</Badge>}
    </Grid>
  )
}
