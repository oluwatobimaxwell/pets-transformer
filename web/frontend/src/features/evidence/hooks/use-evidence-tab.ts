import { useSearchParams } from 'react-router-dom'
import { isEvidenceTab, type EvidenceTab } from '../utils/evidence-tabs'

/** The open tab, kept in the address as ?tab= so a link or a refresh lands on the same view. */
export function useEvidenceTab(): [EvidenceTab, (tab: EvidenceTab) => void] {
  const [params, setParams] = useSearchParams()
  const value = params.get('tab')
  const tab = isEvidenceTab(value) ? value : 'overview'
  const setTab = (next: EvidenceTab) => setParams(next === 'overview' ? {} : { tab: next }, { replace: true })
  return [tab, setTab]
}
