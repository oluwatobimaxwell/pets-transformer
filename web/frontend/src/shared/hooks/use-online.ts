import { useSyncExternalStore } from 'react'

function subscribe(listener: () => void) {
  window.addEventListener('online', listener)
  window.addEventListener('offline', listener)
  return () => {
    window.removeEventListener('online', listener)
    window.removeEventListener('offline', listener)
  }
}

/** Whether the browser thinks it has a network connection. The app runs locally, so this only matters for a remote API. */
export function useOnline() {
  return useSyncExternalStore(subscribe, () => navigator.onLine, () => true)
}
