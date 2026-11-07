import { Button, Field, Heading, HStack, Input, NativeSelect, Stack, Text } from '@chakra-ui/react'
import type { CustomScenarioIn, DatasetOut, QuestionIn } from '@/api/generated'
import { columnOptions } from '../utils/column-options'
import { TRUST_OPTIONS } from '../utils/trust-words'
import { QuestionRow } from './question-row'

interface CustomScenarioFormProps {
  dataset: DatasetOut
  custom: CustomScenarioIn
  onChange: (changes: Partial<CustomScenarioIn>) => void
  onAddQuestion: () => void
  onChangeQuestion: (index: number, question: QuestionIn) => void
  onRemoveQuestion: (index: number) => void
}

/** Who receives the data, how much they're trusted, and what they must still be able to answer. */
export function CustomScenarioForm({ dataset, custom, onChange, onAddQuestion, onChangeQuestion, onRemoveQuestion }: CustomScenarioFormProps) {
  const options = columnOptions(dataset)
  const questions = custom.questions ?? []
  return (
    <Stack gap="6">
      <Stack gap="4" maxW="2xl">
        <Field.Root required>
          <Field.Label>Who receives the data? <Field.RequiredIndicator /></Field.Label>
          <Input value={custom.recipient} placeholder="For example, a university research group" onChange={(e) => onChange({ recipient: e.currentTarget.value })} />
        </Field.Root>
        <Field.Root>
          <Field.Label>What will they use it for?</Field.Label>
          <Input value={custom.purpose ?? ''} placeholder="For example, studying pay by occupation" onChange={(e) => onChange({ purpose: e.currentTarget.value })} />
        </Field.Root>
        <HStack gap="4" align="start" flexWrap="wrap">
          <Field.Root width="auto">
            <Field.Label>How much are they trusted?</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field value={custom.trust_level} onChange={(e) => onChange({ trust_level: e.currentTarget.value as CustomScenarioIn['trust_level'] })}>
                {TRUST_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
          <Field.Root width="auto">
            <Field.Label>Look-alikes per row</Field.Label>
            <Input type="number" min={2} max={100} width="28" value={custom.k ?? ''}
              onChange={(e) => onChange({ k: e.currentTarget.value === '' ? null : Number(e.currentTarget.value) })} />
            <Field.HelperText>Every row must match at least this many others. Leave empty for no bar.</Field.HelperText>
          </Field.Root>
        </HStack>
      </Stack>
      <Stack gap="3">
        <Heading size="md">Questions they must still answer</Heading>
        <Text color="fg.muted" maxW="3xl">
          Only the columns these questions need are released, and each one is scored before and after. With no questions, harmless columns are
          kept and each gets a standard check.
        </Text>
        {questions.map((question, index) => (
          <QuestionRow key={index} number={index + 1} question={question} options={options}
            onChange={(next) => onChangeQuestion(index, next)} onRemove={() => onRemoveQuestion(index)} />
        ))}
        <Button alignSelf="start" variant="outline" size="sm" onClick={onAddQuestion}>Add a question</Button>
      </Stack>
    </Stack>
  )
}
