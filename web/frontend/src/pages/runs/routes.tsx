import type { RouteObject } from 'react-router-dom'
import { Path } from '@/router/paths'
import RunsPage from './runs'

export const runsRoutes: RouteObject[] = [{ path: Path.Runs, element: <RunsPage /> }]
