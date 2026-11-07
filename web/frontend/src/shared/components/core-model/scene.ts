/**
 * The 3D model of a dataset. Every point stands for an equal slice of the records, and the layout mirrors what the
 * release gate has done to them so far: column roles as coloured layers, records that stand out pulled away from the
 * crowd, protected records drawn together into look-alike groups, a release with no rows, and the gate's seal.
 *
 * This file is pure (no DOM), so the layout can be unit-tested.
 */

export type CoreMode = 'idle' | 'data' | 'classes' | 'exposed' | 'grouped' | 'answers'

export interface CoreScene {
  mode: CoreMode
  /** Share of records that stand out (pulled out of the crowd, in mandarin). 0 to 1. */
  exposed: number
  /** Group size the remaining records collapse into (1 = no grouping). */
  k: number
  /** Column roles as coloured layers. Shares sum to 1. */
  layers: { color: string; share: number }[]
  /** The engine is working: spin up and sweep a scan plane. */
  busy: boolean
  /** Tint the records that don't stand out as protected. */
  protect: boolean
  /** 0 nothing, 1 cage drawn (held for review), 2 sealed (released). */
  seal: 0 | 1 | 2
}

export const IDLE_SCENE: CoreScene = { mode: 'idle', exposed: 0, k: 1, layers: [], busy: false, protect: false, seal: 0 }

export type V3 = [number, number, number]

/** Points per side of the lattice: 6 × 6 × 6 = 216 points. */
export const GRID = 6
export const POINTS = GRID * GRID * GRID

export const CORE_COLORS = {
  idle: '#5E8C7D',
  neutral: '#CFE3DA',
  exposed: '#FD550A',
  protect: '#8FD3B6',
  answers: '#E9F5EF',
}

export function hexToRgb(hex: string): V3 {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}

const RGB = {
  idle: hexToRgb(CORE_COLORS.idle),
  neutral: hexToRgb(CORE_COLORS.neutral),
  exposed: hexToRgb(CORE_COLORS.exposed),
  protect: hexToRgb(CORE_COLORS.protect),
  answers: hexToRgb(CORE_COLORS.answers),
}

/** Seeded so the model looks the same on every load. */
function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Interleaves the bits of a lattice position, so neighbours in space sort next to each other. */
function morton(x: number, y: number, z: number) {
  let m = 0
  for (let b = 0; b < 3; b++) m |= (((x >> b) & 1) << (3 * b)) | (((y >> b) & 1) << (3 * b + 1)) | (((z >> b) & 1) << (3 * b + 2))
  return m
}

export interface CorePoint {
  home: V3
  sphere: V3
  blob: V3
  rank: number
  z: number
  layer: number
  pos: V3
  col: V3
  size: number
  tgt: V3
  tcol: V3
  tsize: number
  out: boolean
}

export function buildPoints(): CorePoint[] {
  const r = rng(11)
  const pts: CorePoint[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  const f = (v: number) => ((v / (GRID - 1)) * 2 - 1) * 0.92
  const gauss = () => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r())
  let i = 0
  for (let x = 0; x < GRID; x++)
    for (let y = 0; y < GRID; y++)
      for (let z = 0; z < GRID; z++) {
        const sy = 1 - (i / (POINTS - 1)) * 2
        const rad = Math.sqrt(1 - sy * sy)
        const th = golden * i
        const sphere: V3 = [Math.cos(th) * rad * 1.15, sy * 1.15, Math.sin(th) * rad * 1.15]
        pts.push({
          home: [f(x), f(y), f(z)],
          sphere,
          blob: [gauss() * 0.5, gauss() * 0.42, gauss() * 0.5],
          rank: r(),
          z: morton(x, y, z),
          layer: (GRID - 1 - y) * GRID * GRID + x * GRID + z,
          // Idle start: on the sphere, so the first load visibly assembles the lattice
          pos: [...sphere],
          col: [...RGB.idle],
          size: 1.5,
          tgt: sphere,
          tcol: RGB.idle,
          tsize: 1.5,
          out: false,
        })
        i++
      }
  return pts
}

/** Sets every point's target from the scene. Returns pairs of point indices to draw as group links. */
export function layoutPoints(pts: CorePoint[], sc: CoreScene): [number, number][] {
  const links: [number, number][] = []
  pts.forEach((p) => {
    p.out = false
  })

  if (sc.mode === 'idle') {
    pts.forEach((p) => {
      p.tgt = p.sphere
      p.tcol = RGB.idle
      p.tsize = 1.5
    })
    return links
  }
  if (sc.mode === 'answers') {
    // No rows leave: the records dissolve into a cloud that only answers questions
    pts.forEach((p) => {
      p.tgt = p.blob
      p.tcol = RGB.answers
      p.tsize = 1.9
    })
    return links
  }
  if (sc.mode === 'data' || sc.mode === 'classes') {
    const order = pts.map((_, i) => i).sort((a, b) => pts[a]!.layer - pts[b]!.layer)
    let acc = 0
    let li = 0
    const bounds = sc.layers.map((l) => (acc += l.share))
    order.forEach((idx, n) => {
      const p = pts[idx]!
      p.tgt = p.home
      p.tsize = 2.2
      if (sc.mode === 'classes' && sc.layers.length) {
        while (li < bounds.length - 1 && (n + 0.5) / POINTS > bounds[li]!) li++
        p.tcol = hexToRgb(sc.layers[li]!.color)
      } else p.tcol = sc.protect ? RGB.protect : RGB.neutral
    })
    return links
  }

  // exposed / grouped
  const rest: number[] = []
  pts.forEach((p, i) => {
    if (p.rank < sc.exposed) {
      p.out = true
      const [x, y, z] = p.home
      const jx = ((p.rank * 7.3) % 1) - 0.5
      const jy = ((p.rank * 13.1) % 1) - 0.5
      const jz = ((p.rank * 17.9) % 1) - 0.5
      const d: V3 = [x + jx * 0.3, y + jy * 0.3, z + jz * 0.3]
      // Pulled out of the crowd onto a loose shell, bounded so it stays in frame
      const len = Math.hypot(d[0], d[1], d[2]) || 1
      const rad = 1.22 + ((p.rank * 31.7) % 1) * 0.38
      p.tgt = [(d[0] / len) * rad, (d[1] / len) * rad, (d[2] / len) * rad]
      p.tcol = RGB.exposed
      p.tsize = 3.1
    } else {
      rest.push(i)
      p.tcol = sc.protect ? RGB.protect : RGB.neutral
      p.tsize = 2.2
    }
  })

  const g = sc.mode === 'grouped' ? Math.max(1, Math.min(12, Math.round(sc.k))) : 1
  if (g < 2) {
    rest.forEach((i) => {
      pts[i]!.tgt = pts[i]!.home
    })
    return links
  }
  rest.sort((a, b) => pts[a]!.z - pts[b]!.z)
  for (let s = 0; s < rest.length; s += g) {
    const chunk = rest.slice(s, s + g)
    const c: V3 = [0, 0, 0]
    chunk.forEach((i) => {
      const h = pts[i]!.home
      c[0] += h[0] / chunk.length
      c[1] += h[1] / chunk.length
      c[2] += h[2] / chunk.length
    })
    chunk.forEach((i, n) => {
      const h = pts[i]!.home
      pts[i]!.tgt = [c[0] + (h[0] - c[0]) * 0.26, c[1] + (h[1] - c[1]) * 0.26, c[2] + (h[2] - c[2]) * 0.26]
      if (n) links.push([chunk[n - 1]!, i])
    })
  }
  return links
}
