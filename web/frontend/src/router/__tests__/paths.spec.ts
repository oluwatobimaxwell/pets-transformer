import { describe, expect, it } from 'vitest'
import { buildPath, Path } from '../paths'

describe('buildPath', () => {
  it('fills in the run id', () => {
    expect(buildPath(Path.Run, { runId: 'a1b2c3d4e5f6' })).toBe('/runs/a1b2c3d4e5f6')
  })

  it('leaves a path without parameters alone', () => {
    expect(buildPath(Path.Home)).toBe('/')
  })
})
