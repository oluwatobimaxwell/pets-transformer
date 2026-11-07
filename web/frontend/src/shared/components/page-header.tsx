import type { ReactNode } from 'react'
import { Flex, Heading, Stack, Text } from '@chakra-ui/react'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  /** Buttons or a status rendered on the right (or below, when centered or narrow). */
  actions?: ReactNode
  align?: 'start' | 'center'
}

export function PageHeader({ title, description, actions, align = 'start' }: PageHeaderProps) {
  const centered = align === 'center'

  return (
    <Flex
      direction={centered ? 'column' : { base: 'column', md: 'row' }}
      align={centered ? 'center' : { base: 'start', md: 'end' }}
      justify="space-between"
      textAlign={centered ? 'center' : 'start'}
      gap="4"
    >
      <Stack gap="2">
        <Heading as="h1" textStyle={{ base: '2xl', md: '3xl' }} letterSpacing="display">
          {title}
        </Heading>
        {description && (
          <Text color="fg.muted" maxW="65ch" textStyle={{ base: 'sm', md: 'md' }}>
            {description}
          </Text>
        )}
      </Stack>
      {actions}
    </Flex>
  )
}
