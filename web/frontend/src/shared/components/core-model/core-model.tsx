import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { buildPoints, layoutPoints, type CoreScene, type V3 } from './scene'

/**
 * A small canvas 3D renderer, with no WebGL dependency. The point cloud is a model of the dataset (see scene.ts).
 * It changes only when the data's state changes, rotates with a drag or the arrow keys, and stands still under
 * prefers-reduced-motion. The label is its text alternative and should say what the model currently shows.
 */

const CUBE: V3[] = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z] as V3)))
const EDGES: [number, number][] = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]]

interface CoreModelProps {
  scene: CoreScene
  label: string
  /** Width over height of the drawing area. */
  aspect?: number
}

export function CoreModel({ scene, label, aspect = 1.08 }: CoreModelProps) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef(scene)
  const dirty = useRef(true)
  const key = JSON.stringify(scene)
  const view = useRef({ yaw: 0.7, pitch: -0.42, vYaw: 0, drag: null as null | { x: number; y: number }, kick: 0 })

  useEffect(() => {
    // A burst of spin when the model changes state, so the change reads as an event
    if (sceneRef.current.mode !== scene.mode || sceneRef.current.seal !== scene.seal) view.current.kick = 1
    sceneRef.current = scene
    dirty.current = true
    // The serialised scene is the dependency: a new object with the same content must not restart the kick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv?.getContext?.('2d')
    if (!cv || !ctx) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const pts = buildPoints()
    let links: [number, number][] = []
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let last = performance.now()
    let t = 0
    let seal = 0
    let scan = 0

    const resize = () => {
      const r = cv.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = r.width
      h = r.height
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
    }
    resize()
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    ro?.observe(cv)

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      t += dt
      const sc = sceneRef.current
      const v = view.current
      if (dirty.current) {
        links = layoutPoints(pts, sc)
        dirty.current = false
      }

      if (!v.drag) {
        const base = reduce ? 0 : sc.busy ? 1.5 : 0.2
        v.yaw += dt * (base + (reduce ? 0 : v.kick * 3.2)) + v.vYaw
        v.vYaw *= 0.92
        v.kick *= Math.pow(0.04, dt)
        if (!sc.busy && sc.seal === 2) v.pitch += (-0.5 - v.pitch) * Math.min(1, dt * 2)
      }
      seal += (sc.seal - seal) * (reduce ? 1 : Math.min(1, dt * 3))
      scan += ((sc.busy ? 1 : 0) - scan) * (reduce ? 1 : Math.min(1, dt * 4))

      for (const p of pts) {
        const e = reduce ? 1 : 1 - Math.exp(-dt * (2.4 + p.rank * 3.2))
        for (let j = 0; j < 3; j++) {
          p.pos[j as 0] += (p.tgt[j as 0] - p.pos[j as 0]) * e
          p.col[j as 0] += (p.tcol[j as 0] - p.col[j as 0]) * e
        }
        p.size += (p.tsize - p.size) * e
      }

      const cy = Math.cos(v.yaw)
      const sy = Math.sin(v.yaw)
      const cp = Math.cos(v.pitch)
      const spi = Math.sin(v.pitch)
      const R = Math.min(w, h) * 0.235
      const D = 5.5
      const ox = w / 2
      const oy = h * 0.47
      const proj = (x: number, y: number, z: number): [number, number, number, number] => {
        const x1 = x * cy - z * sy
        const z1 = x * sy + z * cy
        const y2 = y * cp - z1 * spi
        const z2 = y * spi + z1 * cp
        const k = D / (D - z2)
        return [ox + x1 * R * k, oy - y2 * R * k, z2, k]
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      // Ground shadow anchors the model in space
      const gy = oy + R * 1.6
      const grd = ctx.createRadialGradient(ox, gy, 0, ox, gy, R * 1.2)
      grd.addColorStop(0, 'rgba(0,0,0,0.38)')
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.ellipse(ox, gy, R * 1.2, R * 0.2, 0, 0, Math.PI * 2)
      ctx.fill()

      // Scan plane while the engine works
      if (scan > 0.01) {
        const yy = Math.sin(t * 2.4) * 1.05
        const s = 1.2
        const q = [[-s, yy, -s], [s, yy, -s], [s, yy, s], [-s, yy, s]].map(([a, b, c]) => proj(a!, b!, c!))
        ctx.beginPath()
        q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
        ctx.closePath()
        ctx.fillStyle = `rgba(253,85,10,${0.08 * scan})`
        ctx.fill()
        ctx.strokeStyle = `rgba(253,85,10,${0.55 * scan})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      const P = pts.map((p, i) => {
        const bob = p.out && !reduce ? Math.sin(t * 1.7 + p.rank * 40) * 0.035 : 0
        const jit = sc.busy && !reduce ? Math.sin(t * 11 + p.rank * 90) * 0.012 : 0
        return { i, q: proj(p.pos[0] + jit, p.pos[1] + bob, p.pos[2] - jit) }
      })

      if (links.length) {
        ctx.lineWidth = 1
        for (const [a, b] of links) {
          const qa = P[a]!.q
          const qb = P[b]!.q
          const depth = (qa[2] + qb[2]) / 2
          ctx.strokeStyle = `rgba(143,211,182,${0.18 + 0.22 * ((depth + 1.3) / 2.6)})`
          ctx.beginPath()
          ctx.moveTo(qa[0], qa[1])
          ctx.lineTo(qb[0], qb[1])
          ctx.stroke()
        }
      }

      P.sort((a, b) => a.q[2] - b.q[2])
      const unit = Math.max(0.7, Math.min(w, h) / 250)
      for (const { i, q } of P) {
        const p = pts[i]!
        const a = Math.max(0.25, Math.min(1, 0.4 + 0.6 * ((q[2] + 1.4) / 2.8)))
        const r = p.size * q[3] * unit
        if (p.out) {
          ctx.fillStyle = `rgba(253,85,10,${0.16 * a})`
          ctx.beginPath()
          ctx.arc(q[0], q[1], r * 2.4, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = `rgba(${p.col[0] | 0},${p.col[1] | 0},${p.col[2] | 0},${a})`
        ctx.beginPath()
        ctx.arc(q[0], q[1], r, 0, Math.PI * 2)
        ctx.fill()
      }

      // The seal: a cage that draws itself around the records, then locks when the gate releases them
      if (seal > 0.02) {
        const s = 1.18
        const Q = CUBE.map(([x, y, z]) => proj(x * s, y * s, z * s))
        const drawn = Math.min(1, seal)
        const locked = Math.max(0, seal - 1)
        ctx.setLineDash(locked > 0.5 ? [] : [4, 5])
        ctx.lineWidth = 1 + locked * 0.8
        ctx.strokeStyle = locked > 0.5 ? `rgba(143,211,182,${0.5 + 0.4 * locked})` : 'rgba(207,227,218,0.4)'
        EDGES.forEach(([a, b], n) => {
          const grow = Math.max(0, Math.min(1, drawn * EDGES.length - n))
          if (!grow) return
          const pa = Q[a]!
          const pb = Q[b]!
          ctx.beginPath()
          ctx.moveTo(pa[0], pa[1])
          ctx.lineTo(pa[0] + (pb[0] - pa[0]) * grow, pa[1] + (pb[1] - pa[1]) * grow)
          ctx.stroke()
        })
        ctx.setLineDash([])
        if (locked > 0.05) {
          ctx.fillStyle = `rgba(253,85,10,${locked})`
          Q.forEach(([x, y]) => ctx.fillRect(x - 2.5, y - 2.5, 5, 5))
        }
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro?.disconnect()
    }
  }, [])

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    view.current.drag = { x: e.clientX, y: e.clientY }
  }
  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const v = view.current
    if (!v.drag) return
    const dx = e.clientX - v.drag.x
    const dy = e.clientY - v.drag.y
    v.yaw += dx * 0.012
    v.vYaw = dx * 0.002
    v.pitch = Math.max(-1.2, Math.min(0.5, v.pitch - dy * 0.01))
    v.drag = { x: e.clientX, y: e.clientY }
  }
  const onUp = () => {
    view.current.drag = null
  }
  const onKey = (e: KeyboardEvent<HTMLCanvasElement>) => {
    const v = view.current
    const keys: Record<string, () => void> = {
      ArrowLeft: () => { v.vYaw = -0.05 },
      ArrowRight: () => { v.vYaw = 0.05 },
      ArrowUp: () => { v.pitch = Math.max(-1.2, v.pitch - 0.15) },
      ArrowDown: () => { v.pitch = Math.min(0.5, v.pitch + 0.15) },
    }
    const act = keys[e.key]
    if (act) {
      e.preventDefault()
      act()
    }
  }

  const style: CSSProperties = { aspectRatio: String(aspect) }
  return (
    <canvas ref={canvas} className="core-canvas" style={style} tabIndex={0} role="img"
      aria-label={`${label} Drag or use the arrow keys to rotate the model.`}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={onKey} />
  )
}
