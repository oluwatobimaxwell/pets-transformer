import { Box, Button, Field, Grid, HStack, Input, Stack, Text } from '@chakra-ui/react'
import { MessageCircleQuestion, Plus } from 'lucide-react'
import type { CustomScenarioIn, DatasetOut, QuestionIn } from '@/api/generated'
import { columnOptions } from '../utils/column-options'
import { TRUST_CHOICES } from '../utils/trust-words'
import { ChoiceCards } from './choice-cards'
import { FormSection } from './form-section'
import { QuestionRow } from './question-row'

interface CustomScenarioFormProps {
  dataset: DatasetOut
  custom: CustomScenarioIn
  onChange: (changes: Partial<CustomScenarioIn>) => void
  onAddQuestion: () => void
  onChangeQuestion: (index: number, question: QuestionIn) => void
  onRemoveQuestion: (index: number) => void
}

/** Who receives the data, how far they are trusted, the look-alike bar, and what they must still be able to answer. */
export function CustomScenarioForm({ dataset, custom, onChange, onAddQuestion, onChangeQuestion, onRemoveQuestion }: CustomScenarioFormProps) {
  const options = columnOptions(dataset)
  const questions = custom.questions ?? []
  return (
    <Stack gap="5">
      <FormSection title="The recipient" description="Name the person or organisation receiving the data and what they will use it for. Both appear in the evidence.">
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="5">
          <Field.Root required>
            <Field.Label>Who receives the data? <Field.RequiredIndicator /></Field.Label>
            <Input value={custom.recipient} placeholder="For example, a university research group" onChange={(e) => onChange({ recipient: e.currentTarget.value })} />
          </Field.Root>
          <Field.Root>
            <Field.Label>What will they use it for?</Field.Label>
            <Input value={custom.purpose ?? ''} placeholder="For example, studying pay by occupation" onChange={(e) => onChange({ purpose: e.currentTarget.value })} />
          </Field.Root>
        </Grid>
      </FormSection>

      <FormSection title="How far they are trusted" description="Trust decides how much detail can leave. The less trusted the recipient, the coarser the data.">
        <ChoiceCards options={TRUST_CHOICES} value={custom.trust_level} label="How far the recipient is trusted"
          onChange={(trust_level) => onChange({ trust_level })} columns={{ base: '1fr', md: '1fr 1fr' }} />
      </FormSection>

      <FormSection title="Look-alikes per row" description="Every released row must match at least this many others on its clues, so nobody stands out. 5 is a common bar.">
        <HStack gap="3" align="center">
          <Field.Root width="auto">
            <Field.Label srOnly>Look-alikes per row</Field.Label>
            <Input type="number" min={2} max={100} w="28" value={custom.k ?? ''}
              onChange={(e) => onChange({ k: e.currentTarget.value === '' ? null : Number(e.currentTarget.value) })} />
          </Field.Root>
          <Text textStyle="sm" color="fg.muted">Leave empty for no bar.</Text>
        </HStack>
      </FormSection>

      <FormSection title="Questions they must still answer"
        description="Only the columns these questions need are released, and each one is scored on the original and the protected data. With no questions, harmless columns are kept and each gets a standard check.">
        {questions.length === 0 && (
          <HStack gap="3" borderWidth="1px" borderStyle="dashed" borderColor="border.emphasized" rounded="l2" p="4" color="fg.muted" textStyle="sm">
            <MessageCircleQuestion size={18} aria-hidden="true" />
            No questions yet. Add the ones this recipient must still be able to answer.
          </HStack>
        )}
        {questions.map((question, index) => (
          <QuestionRow key={index} number={index + 1} question={question} options={options}
            onChange={(next) => onChangeQuestion(index, next)} onRemove={() => onRemoveQuestion(index)} />
        ))}
        <Box>
          <Button variant="outline" size="sm" onClick={onAddQuestion}>
            <Plus aria-hidden="true" />
            Add a question
          </Button>
        </Box>
      </FormSection>
    </Stack>
  )
}
