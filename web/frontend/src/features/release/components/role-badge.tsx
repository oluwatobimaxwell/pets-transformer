import { Badge } from '@chakra-ui/react'
import { roleWord } from '../utils/role-words'

export function RoleBadge({ role }: { role: string }) {
  const word = roleWord(role)
  const RoleIcon = word.icon
  return (
    <Badge colorPalette={word.palette} variant="subtle">
      <RoleIcon size={12} aria-hidden="true" />
      {word.label}
    </Badge>
  )
}
