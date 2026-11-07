import { useEffect, useState } from 'react'
import { Button, Text } from '@chakra-ui/react'
import { RefreshCw } from 'lucide-react'

interface BootLoaderProps {
  /** The API has answered. */
  ready: boolean
  /** Why the API couldn't be reached, once it has failed. */
  error: string | null
  retrying: boolean
  onRetry: () => void
  /** Shortest time on screen, so a fast answer doesn't flash. */
  minMs?: number
}

/**
 * The studio's boot screen. A lattice cube scans for as long as the app is actually connecting to the local API,
 * then folds away. If the API can't be reached it says so, says how to start it, and offers a retry.
 */
export function BootLoader({ ready, error, retrying, onRetry, minMs = 700 }: BootLoaderProps) {
  const [minDone, setMinDone] = useState(false)
  const [gone, setGone] = useState(false)
  const leaving = ready && minDone

  useEffect(() => {
    const t = setTimeout(() => setMinDone(true), minMs)
    return () => clearTimeout(t)
  }, [minMs])
  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(() => setGone(true), 750)
    return () => clearTimeout(t)
  }, [leaving])

  if (gone) return null
  const failed = Boolean(error) && !ready && !retrying
  const state = leaving ? 'out' : failed ? 'failed' : 'in'

  return (
    <div className="boot" data-state={state} role="status" aria-live="polite" aria-busy={!leaving && !failed}>
      <div className="boot-cube" aria-hidden="true">
        <div className="lc">
          <i className="f1" />
          <i className="f2" />
          <i className="f3" />
          <i className="f4" />
          <i className="f5" />
          <i className="f6" />
          <b className="scan" />
          <span className="core" />
        </div>
      </div>
      <div style={{ textAlign: 'center', display: 'grid', gap: 8, justifyItems: 'center', maxWidth: 440 }}>
        <Text m="0" fontSize="3xl" fontWeight="bold" letterSpacing="-0.03em" lineHeight="1">PETs Transformer</Text>
        <Text m="0" className="boot-msg" fontFamily="mono" fontSize="sm" color="deep.muted">
          {failed ? "Can't reach the release gate's API." : leaving ? 'Connected' : 'Starting the release gate'}
        </Text>
        {failed && (
          <>
            <Text m="0" fontSize="sm" color="deep.muted">
              {error} Start the backend with <code>uvicorn app.main:app --port 8000</code> or <code>docker compose up</code>, then try again.
            </Text>
            <Button colorPalette="accent" mt="2" onClick={onRetry}>
              <RefreshCw aria-hidden="true" />
              Try connecting again
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
