import { useState } from 'react'
import { Tabs } from '@chakra-ui/react'
import { ListChecks, PenLine } from 'lucide-react'
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
    <Tabs.Root value={tab} onValueChange={(e) => switchTab(e.value)} variant="line" lazyMount>
      <Tabs.List>
        <Tabs.Trigger value="custom"><PenLine size={16} aria-hidden="true" />Describe your recipient</Tabs.Trigger>
        {isSample && <Tabs.Trigger value="challenge"><ListChecks size={16} aria-hidden="true" />Use a challenge scenario</Tabs.Trigger>}
      </Tabs.List>
      <Tabs.Content value="custom" pt="6">
        <CustomScenarioForm dataset={dataset} custom={draft.custom} onChange={api.updateCustom} onAddQuestion={api.addQuestion}
          onChangeQuestion={api.changeQuestion} onRemoveQuestion={api.removeQuestion} />
      </Tabs.Content>
      {isSample && (
        <Tabs.Content value="challenge" pt="6">
          <ScenarioList dataset={dataset.name} chosen={draft.scenarioId} onChoose={chooseScenario} />
        </Tabs.Content>
      )}
    </Tabs.Root>
  )
}
