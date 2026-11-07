import type { RouteObject } from 'react-router-dom'
import { Path } from '@/router/paths'
import LandingPage from './landing'

export const landingRoutes: RouteObject[] = [{ path: Path.Home, element: <LandingPage /> }]
