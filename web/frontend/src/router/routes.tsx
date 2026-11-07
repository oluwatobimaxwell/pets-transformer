/**
 * Application Routes. Each page owns its routes; this file composes them.
 *
 * /                     the landing page
 * /release/data … /run  the four steps of a release, one page each, in the studio
 * /runs, /runs/:runId   every run, and one run's decision and evidence, in the studio
 */

import type { RouteObject } from 'react-router-dom'
import { StudioLayout } from '@/router/layouts/studio-layout'
import { RouteErrorBoundary } from '@/router/error-boundary'
import NotFoundPage from '@/shared/components/not-found-page'
import { landingRoutes } from '@/pages/landing'
import { releaseRoutes } from '@/pages/release'
import { runsRoutes } from '@/pages/runs'
import { runRoutes } from '@/pages/run'
// blacksmith:import

export const routes: RouteObject[] = [
  ...landingRoutes.map((route) => ({ ...route, errorElement: <RouteErrorBoundary /> })),
  {
    element: <StudioLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      ...releaseRoutes,
      ...runsRoutes,
      ...runRoutes,
      // blacksmith:routes
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]
