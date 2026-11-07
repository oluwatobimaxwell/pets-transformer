import { StudioProvider } from '@/features/release'
import { StudioShell } from './components/studio-shell'

/** Every studio page: the run history and each run. */
export function StudioLayout() {
  return (
    <StudioProvider>
      <StudioShell />
    </StudioProvider>
  )
}
