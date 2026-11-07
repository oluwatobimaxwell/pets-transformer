import { useEffect, useRef } from 'react'

/** Brings the element back into view whenever `value` changes, such as a step in a flow, so the person keeps their place. */
export function useScrollIntoView<T extends HTMLElement>(value: unknown) {
  const ref = useRef<T>(null)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    ref.current?.scrollIntoView({ block: 'nearest' })
  }, [value])
  return ref
}
