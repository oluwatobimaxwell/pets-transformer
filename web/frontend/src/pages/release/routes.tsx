import { Navigate, type RouteObject } from 'react-router-dom'
import { Path } from '@/router/paths'
import ColumnsPage from './columns-page'
import DataPage from './data-page'
import RecipientPage from './recipient-page'
import RunGatePage from './run-gate-page'
import RunningPage from './running-page'
import { RequireStep } from './require-step'

/** The wizard: four steps, one page each, then the gate running. A step's page opens once the steps before it are answered. */
export const releaseRoutes: RouteObject[] = [
  { path: Path.Release, element: <Navigate to={Path.ReleaseData} replace /> },
  { path: Path.ReleaseData, element: <DataPage /> },
  { path: Path.ReleaseRecipient, element: <RequireStep step={1}><RecipientPage /></RequireStep> },
  { path: Path.ReleaseColumns, element: <RequireStep step={2}><ColumnsPage /></RequireStep> },
  { path: Path.ReleaseRun, element: <RequireStep step={3}><RunGatePage /></RequireStep> },
  { path: Path.ReleaseRunning, element: <RunningPage /> },
]
