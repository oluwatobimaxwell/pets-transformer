import type { RouteObject } from 'react-router-dom'
import { Path } from '@/router/paths'
import RunPage from './run'

export const runRoutes: RouteObject[] = [{ path: Path.Run, element: <RunPage /> }]
