import { Badge } from '@chakra-ui/react'
import { statusWord } from '../utils/status-words'

export function StatusBadge({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' | 'lg' }) {
  const word = statusWord(status)
  const StatusIcon = word.icon
  return (
    <Badge size={size} colorPalette={word.palette} variant="subtle">
      <StatusIcon size={size === 'lg' ? 14 : 12} aria-hidden="true" style={word.finished ? undefined : { animation: 'spin 1.2s linear infinite' }} />
      {word.label}
    </Badge>
  )
}
