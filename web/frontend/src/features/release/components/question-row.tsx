import { Badge, Button, HStack, Input, NativeSelect, Stack, Text } from '@chakra-ui/react'
import { Trash2 } from 'lucide-react'
import type { QuestionIn } from '@/api/generated'
import type { QuestionKind } from '../types'
import { emptyQuestion } from '../utils/empty-question'
import { QUESTION_KINDS, questionKind } from '../utils/question-kinds'
import { replaceAt } from '../utils/replace-at'
import { ColumnSelect } from './column-select'

interface QuestionRowProps {
  number: number
  question: QuestionIn
  options: { value: string; label: string }[]
  onChange: (question: QuestionIn) => void
  onRemove: () => void
}

/** One question the recipient must still be able to answer. */
export function QuestionRow({ number, question, options, onChange, onRemove }: QuestionRowProps) {
  const shape = questionKind(question.kind)
  const columns = question.columns ?? []
  const by = question.by ?? []
  return (
    <Stack gap="3" borderWidth="1px" borderColor="border" bg="bg.panel" rounded="l3" p="4" animation="rise 180ms var(--chakra-easings-out)">
      <HStack gap="3" flexWrap="wrap">
        <Badge variant="subtle" colorPalette="brand" fontFamily="mono" size="lg">Q{number}</Badge>
        <Input size="sm" flex="1" minW="56" placeholder="The question in plain words" aria-label={`Question ${number} in plain words`}
          value={question.ask ?? ''} onChange={(event) => onChange({ ...question, ask: event.currentTarget.value })} />
        <Button size="sm" variant="ghost" onClick={onRemove} aria-label={`Remove question ${number}`}>
          <Trash2 aria-hidden="true" />
          <Text as="span" hideBelow="sm">Remove</Text>
        </Button>
      </HStack>
      <HStack gap="2" flexWrap="wrap">
        <NativeSelect.Root size="sm" width="auto">
          <NativeSelect.Field value={question.kind} aria-label="Kind of question"
            onChange={(event) => onChange({ ...emptyQuestion(event.currentTarget.value as QuestionKind), ask: question.ask })}>
            {QUESTION_KINDS.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        {columns.map((column, index) => (
          <ColumnSelect key={`c${index}`} value={column} options={options} label={`Number column ${index + 1}`}
            placeholder={shape.columns > 1 ? `Column ${index + 1}` : 'Column'} onChange={(value) => onChange({ ...question, columns: replaceAt(columns, index, value) })} />
        ))}
        {shape.grouped && <Text textStyle="sm" color="fg.muted">by</Text>}
        {by.map((column, index) => (
          <ColumnSelect key={`b${index}`} value={column} options={options} label={`Group by ${index + 1}`}
            placeholder="Group by" onChange={(value) => onChange({ ...question, by: replaceAt(by, index, value) })} />
        ))}
        {shape.grouped && by.length < 2 && (
          <Button size="xs" variant="ghost" onClick={() => onChange({ ...question, by: [...by, ''] })}>+ another group</Button>
        )}
      </HStack>
    </Stack>
  )
}
