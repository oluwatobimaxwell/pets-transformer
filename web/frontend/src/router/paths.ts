/**
 * Application Route Paths. Use these instead of hardcoded strings for type-safe navigation.
 */

export enum Path {
  /** The landing page: what the gate does, with a live 3D demo. */
  Home = '/',
  /** The release studio. Each step has its own page, in this order. */
  Release = '/release',
  ReleaseData = '/release/data',
  ReleaseRecipient = '/release/recipient',
  ReleaseColumns = '/release/columns',
  ReleaseRun = '/release/run',
  /** The gate working on a release just started, until it decides. */
  ReleaseRunning = '/release/running/:runId',
  /** Every run on this machine, newest first. */
  Runs = '/runs',
  Run = '/runs/:runId',
  // blacksmith:path
}

/**
 * Build a path with dynamic parameters replaced.
 *
 * @example
 *   buildPath(Path.Run, { runId: 'a1b2c3d4e5f6' })
 *   // => '/runs/a1b2c3d4e5f6'
 */
export function buildPath(
  path: Path,
  params?: Record<string, string>,
): string {
  let result: string = path
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      result = result.replace(`:${key}`, encodeURIComponent(value))
    }
  }
  return result
}
