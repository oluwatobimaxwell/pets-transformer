import { Badge } from '@chakra-ui/react'
import { techniqueWord } from '../utils/technique-words'

/** A technique as a tag: its icon and plain name, with what it does on hover. */
export function TechniqueChip({ technique }: { technique: string }) {
  const word = techniqueWord(technique)
  const TechniqueIcon = word.icon
  return (
    <Badge colorPalette={word.palette} variant="subtle" title={word.says}>
      <TechniqueIcon size={12} aria-hidden="true" />
      {word.label}
    </Badge>
  )
}
