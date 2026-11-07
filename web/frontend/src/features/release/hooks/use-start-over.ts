import { useNavigate } from 'react-router-dom'
import { Path } from '@/router/paths'
import { useDraft } from '../context/studio-context'

/** Forget the draft and go back to the first step, for Start over and New release. */
export function useStartOver() {
  const { reset } = useDraft()
  const navigate = useNavigate()
  return () => {
    reset()
    navigate(Path.ReleaseData)
  }
}
