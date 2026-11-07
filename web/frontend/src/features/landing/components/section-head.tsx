import { Heading, Stack, Text } from '@chakra-ui/react'

/** A section's title and one-sentence lead. */
export function SectionHead({ id, title, lead }: { id: string; title: string; lead: string }) {
  return (
    <Stack gap="3" mb={{ base: '8', md: '12' }} maxW="3xl">
      <Heading as="h2" id={id} fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" letterSpacing="-0.025em" lineHeight="1.1">{title}</Heading>
      <Text fontSize={{ base: 'md', md: 'lg' }} color="fg.muted" lineHeight="1.6">{lead}</Text>
    </Stack>
  )
}
