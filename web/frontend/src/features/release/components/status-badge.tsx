import { Badge } from '@chakra-ui/react'
import { statusWord } from '../utils/status-words'

export function StatusBadge({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' | 'lg' }) {
  const word = statusWord(status)
  return <Badge size={size} colorPalette={word.palette} variant="solid">{word.label}</Badge>
}
