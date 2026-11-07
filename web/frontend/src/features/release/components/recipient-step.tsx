import { useState } from 'react'
import { HStack, Stack, Text } from '@chakra-ui/react'
import { Info } from 'lucide-react'
import type { ReleaseDraftApi } from '../hooks/use-release-draft'
import { initialRecipientMode, RECIPIENT_MODES, type RecipientMode } from '../utils/recipient-modes'
import { ChoiceCards } from './choice-cards'
import { CustomScenarioForm } from './custom-scenario-form'
import { ScenarioList } from './scenario-list'

interface RecipientStepProps {
  api: ReleaseDraftApi
}

/**
 * Who receives the data. A challenge dataset opens on its challenge scenarios, with describing your own recipient as the
 * other choice; uploaded data can only be described.
 */
export function RecipientStep({ api }: RecipientStepProps) {
  const { draft, chooseScenario } = api
  const dataset = draft.dataset!
  const isSample = dataset.source === 'sample'
  const [mode, setMode] = useState<RecipientMode>(() => initialRecipientMode(draft))
  const switchMode = (next: RecipientMode) => {
    setMode(next)
    if (next === 'custom') chooseScenario(null)
  }
  return (
    <Stack gap="6">
      {isSample ? (
        <ChoiceCards options={RECIPIENT_MODES} value={mode} onChange={switchMode} label="How to describe the recipient" />
      ) : (
        <HStack gap="2.5" textStyle="sm" color="fg.muted">
          <Info size={16} aria-hidden="true" />
          <Text>Challenge scenarios belong to the challenge datasets, so describe the recipient of your own data below.</Text>
        </HStack>
      )}
      <div key={mode} className="stagger">
        {mode === 'challenge' ? (
          <Stack gap="3">
            <Text textStyle="sm" color="fg.muted">Choose the scenario that matches who receives <Text as="span" fontFamily="mono" color="fg">{dataset.name}</Text>.</Text>
            <ScenarioList dataset={dataset.name} chosen={draft.scenarioId} onChoose={chooseScenario} />
          </Stack>
        ) : (
          <CustomScenarioForm dataset={dataset} custom={draft.custom} onChange={api.updateCustom} onAddQuestion={api.addQuestion}
            onChangeQuestion={api.changeQuestion} onRemoveQuestion={api.removeQuestion} />
        )}
      </div>
    </Stack>
  )
}
