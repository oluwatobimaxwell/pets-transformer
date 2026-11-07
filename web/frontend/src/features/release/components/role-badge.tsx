import { Badge } from '@chakra-ui/react'
import { roleWord } from '../utils/role-words'

export function RoleBadge({ role }: { role: string }) {
  const word = roleWord(role)
  return <Badge colorPalette={word.palette} variant="subtle">{word.label}</Badge>
}
