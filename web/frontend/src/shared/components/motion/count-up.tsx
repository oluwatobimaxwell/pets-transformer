import { useEffect, useRef, useState } from 'react'

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

interface CountUpProps {
  value: number | null | undefined
  format: (value: number) => string
  /** Length of the tween in milliseconds. */
  ms?: number
}

/**
 * A number that counts from its previous value to the new one, so a change in a metric reads as movement.
 * It counts up from zero when it first appears. Screen readers get the final value only, never the frames.
 */
export function CountUp({ value, format, ms = 700 }: CountUpProps) {
  const [shown, setShown] = useState<number | null>(value == null ? null : 0)
  const from = useRef<number | null>(value == null ? null : 0)

  useEffect(() => {
    if (value == null) {
      from.current = null
      setShown(null)
      return
    }
    const start = from.current ?? value
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (reduce || start === value || typeof requestAnimationFrame === 'undefined') {
      from.current = value
      setShown(value)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / ms)
      const v = start + (value - start) * easeOut(t)
      from.current = v
      setShown(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, ms])

  const final = value == null ? '–' : format(value)
  return (
    <>
      <span aria-hidden="true" style={{ fontVariantNumeric: 'tabular-nums' }}>{shown == null ? '–' : format(shown)}</span>
      <span style={SR_ONLY}>{final}</span>
    </>
  )
}

const SR_ONLY = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const
