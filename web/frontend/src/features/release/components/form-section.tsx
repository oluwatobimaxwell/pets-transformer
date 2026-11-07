import type { ReactNode } from 'react'
import { Heading, Stack, Text } from '@chakra-ui/react'

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
}

/** One part of a form: a heading, a sentence on why it matters, then its fields. */
export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Stack as="fieldset" gap="4" p={{ base: '5', md: '6' }} rounded="l3" borderWidth="1px" borderColor="border" bg="bg.panel">
      <Stack gap="1">
        <Heading as="legend" textStyle="md" fontWeight="semibold">{title}</Heading>
        {description && <Text textStyle="sm" color="fg.muted" maxW="70ch">{description}</Text>}
      </Stack>
      {children}
    </Stack>
  )
}
