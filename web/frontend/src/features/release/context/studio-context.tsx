import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useReleaseDraft, type ReleaseDraftApi } from '../hooks/use-release-draft'
import { EMPTY_VIEW, type StudioView } from '../utils/studio-view'

interface StudioContextValue {
  api: ReleaseDraftApi
  view: StudioView
  setView: (view: StudioView) => void
}

const StudioContext = createContext<StudioContextValue | null>(null)

/**
 * Shared by every studio page: the release draft (so moving between step pages keeps every choice) and the view the
 * current page publishes for the rail's 3D model.
 */
export function StudioProvider({ children }: { children: ReactNode }) {
  const api = useReleaseDraft()
  const [view, setView] = useState<StudioView>(EMPTY_VIEW)
  return <StudioContext.Provider value={{ api, view, setView }}>{children}</StudioContext.Provider>
}

function useStudio() {
  const value = useContext(StudioContext)
  if (!value) throw new Error('Studio pages must render inside <StudioProvider>.')
  return value
}

/** The release draft and its actions. */
export function useDraft() {
  return useStudio().api
}

/** What the rail currently shows. */
export function useStudioView() {
  return useStudio().view
}

/** A page says what the model should show. Only a change in content republishes, so a re-render costs nothing. */
export function usePublishView(view: StudioView) {
  const { setView } = useStudio()
  const key = JSON.stringify(view)
  useEffect(() => {
    setView(view)
    // The serialised view is the dependency, so a new object with the same content doesn't republish
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, setView])
}
