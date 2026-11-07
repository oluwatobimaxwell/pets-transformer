import { buildPoints, CORE_COLORS, hexToRgb, IDLE_SCENE, layoutPoints, POINTS } from '../scene'

describe('the 3D dataset model', () => {
  it('builds one point per lattice cell, the same on every load', () => {
    const first = buildPoints()
    const second = buildPoints()
    expect(first).toHaveLength(POINTS)
    expect(first.map((p) => p.rank)).toEqual(second.map((p) => p.rank))
  })

  it('rests on a sphere when there is no data', () => {
    const pts = buildPoints()
    layoutPoints(pts, IDLE_SCENE)
    for (const p of pts) expect(p.tgt).toBe(p.sphere)
  })

  it('colours the lattice by role, in proportion to the column shares', () => {
    const pts = buildPoints()
    layoutPoints(pts, { ...IDLE_SCENE, mode: 'classes', layers: [{ color: '#FD550A', share: 0.25 }, { color: '#8FD3B6', share: 0.75 }] })
    const mandarin = pts.filter((p) => p.tcol.join() === hexToRgb('#FD550A').join()).length
    expect(mandarin / POINTS).toBeCloseTo(0.25, 1)
  })

  it('pulls out the share of records that stand out, and only those', () => {
    const pts = buildPoints()
    layoutPoints(pts, { ...IDLE_SCENE, mode: 'exposed', exposed: 0.4 })
    const out = pts.filter((p) => p.out)
    expect(out.length / POINTS).toBeGreaterThan(0.3)
    expect(out.length / POINTS).toBeLessThan(0.5)
    for (const p of out) expect(p.tcol).toEqual(hexToRgb(CORE_COLORS.exposed))
  })

  it('links protected records into groups of k', () => {
    const pts = buildPoints()
    const links = layoutPoints(pts, { ...IDLE_SCENE, mode: 'grouped', k: 5, protect: true })
    // Each group of 5 contributes 4 links; the last group may be smaller
    expect(links.length).toBe(POINTS - Math.ceil(POINTS / 5))
    for (const p of pts) expect(p.tcol).toEqual(hexToRgb(CORE_COLORS.protect))
  })

  it('draws no groups when k is 1', () => {
    const pts = buildPoints()
    expect(layoutPoints(pts, { ...IDLE_SCENE, mode: 'grouped', k: 1 })).toHaveLength(0)
  })
})
