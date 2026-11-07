import { Box, Button, Field, Grid, Heading, Input, NativeSelect, Stack, Text } from '@chakra-ui/react'
import { MessageCircleQuestion, Plus } from 'lucide-react'
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
    <Stack gap="8">
      <Stack as="fieldset" gap="5" maxW="3xl">
        <Heading as="legend" textStyle="md" mb="1">The recipient</Heading>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="5">
          <Field.Root required>
            <Field.Label>Who receives the data? <Field.RequiredIndicator /></Field.Label>
            <Input value={custom.recipient} placeholder="For example, a university research group" onChange={(e) => onChange({ recipient: e.currentTarget.value })} />
          </Field.Root>
          <Field.Root>
            <Field.Label>What will they use it for?</Field.Label>
            <Input value={custom.purpose ?? ''} placeholder="For example, studying pay by occupation" onChange={(e) => onChange({ purpose: e.currentTarget.value })} />
          </Field.Root>
          <Field.Root>
            <Field.Label>How much are they trusted?</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field value={custom.trust_level} onChange={(e) => onChange({ trust_level: e.currentTarget.value as CustomScenarioIn['trust_level'] })}>
                {TRUST_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
          <Field.Root>
            <Field.Label>Look-alikes per row</Field.Label>
            <Input type="number" min={2} max={100} maxW="32" value={custom.k ?? ''}
              onChange={(e) => onChange({ k: e.currentTarget.value === '' ? null : Number(e.currentTarget.value) })} />
            <Field.HelperText>Every row must match at least this many others. Leave empty for no bar.</Field.HelperText>
          </Field.Root>
        </Grid>
      </Stack>
      <Stack gap="4">
        <Stack gap="1">
          <Heading as="h3" textStyle="md">Questions they must still answer</Heading>
          <Text textStyle="sm" color="fg.muted" maxW="70ch">
            Only the columns these questions need are released, and each one is scored before and after. With no questions, harmless columns are
            kept and each gets a standard check.
          </Text>
        </Stack>
        {questions.length === 0 && (
          <Box borderWidth="1px" borderStyle="dashed" borderColor="border.emphasized" rounded="l3" p="5" color="fg.muted" textStyle="sm">
            <MessageCircleQuestion size={18} aria-hidden="true" style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
            No questions yet. Add the ones this recipient must still be able to answer.
          </Box>
        )}
        {questions.map((question, index) => (
          <QuestionRow key={index} number={index + 1} question={question} options={options}
            onChange={(next) => onChangeQuestion(index, next)} onRemove={() => onRemoveQuestion(index)} />
        ))}
        <Button alignSelf="start" variant="outline" size="sm" onClick={onAddQuestion}>
          <Plus aria-hidden="true" />
          Add a question
        </Button>
      </Stack>
    </Stack>
  )
}
