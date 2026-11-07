import { SimpleGrid, Stat } from '@chakra-ui/react'
import { formatPercent, formatScore } from '../utils/format-score'

interface ScoreTilesProps {
  summary: {
    scores?: { privacy?: number; utility?: number } | null
    rows?: { kept?: number; total?: number }
    answers?: { epsilon: number; contribution_bound: number; answered: number; questions: number } | null
  }
}

/** The headline numbers of a finished run. */
export function ScoreTiles({ summary }: ScoreTilesProps) {
  const scores = summary.scores ?? {}
  const rows = summary.rows ?? {}
  const answers = summary.answers
  const tiles = [
    answers && { label: 'Privacy budget', value: `ε ${answers.epsilon}`, help: `Differential privacy, at most ${answers.contribution_bound} records per person` },
    answers && { label: 'Answers published', value: `${answers.answered} of ${answers.questions}`, help: 'Noisy answers, not rows' },
    scores.privacy !== undefined && { label: 'Privacy', value: formatScore(scores.privacy), help: 'Public checks found no remaining risk at 1.00' },
    scores.utility !== undefined && { label: 'Usefulness', value: formatScore(scores.utility), help: 'Average score of the required questions' },
    rows.total ? { label: 'Rows kept', value: formatPercent((rows.kept ?? 0) / rows.total), help: `${(rows.kept ?? 0).toLocaleString()} of ${rows.total.toLocaleString()}` } : false,
  ].filter(Boolean) as { label: string; value: string; help: string }[]
  return (
    <SimpleGrid columns={{ base: 1, sm: tiles.length }} gap="3">
      {tiles.map((tile) => (
        <Stat.Root key={tile.label} borderWidth="1px" rounded="l2" p="4">
          <Stat.Label>{tile.label}</Stat.Label>
          <Stat.ValueText>{tile.value}</Stat.ValueText>
          <Stat.HelpText>{tile.help}</Stat.HelpText>
        </Stat.Root>
      ))}
    </SimpleGrid>
  )
}
