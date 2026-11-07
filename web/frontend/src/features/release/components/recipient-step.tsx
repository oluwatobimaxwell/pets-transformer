import { useState } from 'react'
import { Tabs } from '@chakra-ui/react'
import type { ReleaseDraftApi } from '../hooks/use-release-draft'
import { CustomScenarioForm } from './custom-scenario-form'
import { ScenarioList } from './scenario-list'

interface RecipientStepProps {
  api: ReleaseDraftApi
}

/** A challenge scenario for a challenge sample, or the person's own description for anything. */
export function RecipientStep({ api }: RecipientStepProps) {
  const { draft, chooseScenario } = api
  const dataset = draft.dataset!
  const isSample = dataset.source === 'sample'
  const [tab, setTab] = useState(draft.scenarioId ? 'challenge' : 'custom')
  const switchTab = (value: string) => {
    setTab(value)
    if (value === 'custom') chooseScenario(null)
  }
  return (
    <Tabs.Root value={tab} onValueChange={(e) => switchTab(e.value)} variant="line">
      <Tabs.List>
        <Tabs.Trigger value="custom">Describe your recipient</Tabs.Trigger>
        {isSample && <Tabs.Trigger value="challenge">Use a challenge scenario</Tabs.Trigger>}
      </Tabs.List>
      <Tabs.Content value="custom">
        <CustomScenarioForm dataset={dataset} custom={draft.custom} onChange={api.updateCustom} onAddQuestion={api.addQuestion}
          onChangeQuestion={api.changeQuestion} onRemoveQuestion={api.removeQuestion} />
      </Tabs.Content>
      {isSample && (
        <Tabs.Content value="challenge">
          <ScenarioList dataset={dataset.name} chosen={draft.scenarioId} onChoose={chooseScenario} />
        </Tabs.Content>
      )}
    </Tabs.Root>
  )
}
