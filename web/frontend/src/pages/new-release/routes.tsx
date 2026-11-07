import type { RouteObject } from 'react-router-dom'
import { Path } from '@/router/paths'
import NewReleasePage from './new-release'

export const newReleaseRoutes: RouteObject[] = [{ path: Path.Home, element: <NewReleasePage /> }]
