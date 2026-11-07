/**
 * Application Routes. Each page owns its routes; this file composes them.
 */

import type { RouteObject } from 'react-router-dom'
import { MainLayout } from '@/router/layouts/main-layout'
import { RouteErrorBoundary } from '@/router/error-boundary'
import NotFoundPage from '@/shared/components/not-found-page'
import { newReleaseRoutes } from '@/pages/new-release'
import { runRoutes } from '@/pages/run'
// blacksmith:import

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      ...newReleaseRoutes,
      ...runRoutes,
      // blacksmith:routes
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]
