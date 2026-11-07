import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { STEP_WORDS, useDraft } from '@/features/release'

/** A step page opens only once the steps before it are answered; otherwise it sends the person to the first open one. */
export function RequireStep({ step, children }: { step: number; children: ReactNode }) {
  const { reachable } = useDraft()
  if (step > reachable) return <Navigate to={STEP_WORDS[reachable]!.path} replace />
  return <>{children}</>
}
