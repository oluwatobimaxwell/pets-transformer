/**
 * Root Application Component: providers and the router.
 */

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { Provider } from '@/shared/components/ui/provider'
import { queryClient } from '@/api/query-client'
import { router } from '@/router'

// Initialize API client
import '@/api/client'

export function App() {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </Provider>
  )
}
