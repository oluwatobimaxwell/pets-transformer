import { StudioProvider } from '@/features/release'
import { WizardFrame } from './components/wizard-frame'

/**
 * The full-screen wizard for a new release: no app chrome, one step at a time, with the steps and the release so far
 * down the side. The draft is shared by every step and survives a refresh in this tab.
 */
export function WizardLayout() {
  return (
    <StudioProvider>
      <WizardFrame />
    </StudioProvider>
  )
}
