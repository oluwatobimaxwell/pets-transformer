import { useEffect, useState } from 'react'

/**
 * Steps through `count` stages every `ms` until the person picks one, pausing while they hover or focus the demo.
 * With reduced motion it never advances on its own.
 */
export function useAutoAdvance(count: number, ms: number) {
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!auto || paused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), ms)
    return () => clearTimeout(timer)
  }, [auto, paused, count, ms, index])

  const pick = (next: number) => {
    setIndex(next)
    setAuto(false)
  }
  return { index, pick, pause: () => setPaused(true), resume: () => setPaused(false) }
}
