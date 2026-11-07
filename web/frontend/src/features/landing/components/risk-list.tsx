import { Circle, Grid, HStack, Heading, Stack, Text } from '@chakra-ui/react'
import { CircleAlert } from 'lucide-react'
import { RISKS } from '../content'

/** What the gate couldn't rule out, stated plainly, so the person releasing the data decides with the full picture. */
export function RiskList() {
  return (
    <Grid as="ul" listStyleType="none" templateColumns={{ base: '1fr', md: '1fr 1fr' }} columnGap="10" rowGap="0">
      {RISKS.map((risk) => (
        <HStack as="li" key={risk.title} gap="4" align="start" py="5" borderTopWidth="1px" borderColor="border">
          <Circle size="8" bg="accent.subtle" color="accent.fg" flexShrink="0"><CircleAlert size={16} aria-hidden="true" /></Circle>
          <Stack gap="1">
            <Heading as="h3" fontSize="md">{risk.title}</Heading>
            <Text fontSize="sm" color="fg.muted" lineHeight="1.6">{risk.text}</Text>
          </Stack>
        </HStack>
      ))}
    </Grid>
  )
}
