import type { LucideIcon } from 'lucide-react'
import { Circle, Stack, Text } from '@chakra-ui/react'

/** What a view would show, when this run has none of it, and why. */
export function EvidenceEmpty({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <Stack align="center" textAlign="center" gap="2" py="12" px="6" borderWidth="1px" borderStyle="dashed" borderColor="border.emphasized" rounded="l3">
      <Circle size="10" bg="bg.muted" color="fg.muted"><Icon size={18} aria-hidden="true" /></Circle>
      <Text fontWeight="semibold">{title}</Text>
      <Text textStyle="sm" color="fg.muted" maxW="52ch">{text}</Text>
    </Stack>
  )
}
