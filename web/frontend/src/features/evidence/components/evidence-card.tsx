import type { ReactNode } from 'react'
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react'

interface EvidenceCardProps {
  title?: ReactNode
  description?: ReactNode
  /** A link or button at the card's top right, such as "See every check". */
  action?: ReactNode
  /** Content that runs to the card's edges, such as a table or a divided list. */
  flush?: boolean
  children: ReactNode
}

/** The one card every piece of evidence sits in: a title, what it shows, and the content. */
export function EvidenceCard({ title, description, action, flush = false, children }: EvidenceCardProps) {
  return (
    <Stack as="section" gap="0" bg="bg.panel" borderWidth="1px" borderColor="border" rounded="l3" overflow="hidden" minW="0">
      {(title || action) && (
        <Flex gap="4" justify="space-between" align="start" px={{ base: '4', md: '5' }} pt={{ base: '4', md: '5' }} pb={flush ? '4' : '0'}
          borderBottomWidth={flush ? '1px' : '0'} borderColor="border.muted">
          <Stack gap="1" minW="0">
            {title && <Heading as="h3" textStyle="md" fontWeight="semibold" letterSpacing="-0.01em">{title}</Heading>}
            {description && <Text textStyle="sm" color="fg.muted" maxW="70ch">{description}</Text>}
          </Stack>
          {action && <Box flexShrink="0">{action}</Box>}
        </Flex>
      )}
      <Box p={flush ? '0' : { base: '4', md: '5' }} minW="0">{children}</Box>
    </Stack>
  )
}
