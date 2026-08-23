import { useEffect, useRef } from 'react'
import { decayPulse, sceneBus } from '~/lib/sceneBus'

const VOID = '#121316'
const SIGNAL: RGB = [242, 161, 58]
const LIVE: RGB = [53, 214, 138]
const STEEL: RGB = [104, 112, 126]

type RGB = [number, number, number]

type Node = {
  x: number
  y: number
  cluster: number
  hub: boolean
  seed: number
  /** 0..1 — how far the node has faded in since first entering the viewport. */
  lit: number
}

type Edge = {
  a: number
  b: number
  trunk: boolean
  /** Runs between clusters, so it is routed orthogonally like a schematic. */
  elbow: boolean
  /** 0..1 — how much of the edge has been drawn. Only ever increases. */
  grow: number
}

type Packet = {
  edge: number
  t: number
  speed: number
}

type Graph = {
  nodes: Node[]
  edges: Edge[]
  packets: Packet[]
  worldH: number
}

function rgba(c: RGB, a: number) {
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`
}

/** Deterministic PRNG so the shop floor is laid out the same way every visit. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildGraph(w: number, h: number, clusters: number, compact: boolean): Graph {
  const rand = mulberry32(0x5eed)
  const nodes: Node[] = []
  const edges: Edge[] = []
  const worldH = clusters * h
  const hubs: number[] = []
  const rings: number[][] = []
  const unit = Math.min(w, h)

  for (let i = 0; i < clusters; i++) {
    // Snake the spine left and right so the pipeline reads as a route.
    const ax = w * (0.5 + 0.27 * Math.sin(i * 1.9 + 0.6))
    const ay = (i + 0.5) * h

    hubs.push(nodes.length)
    nodes.push({ x: ax, y: ay, cluster: i, hub: true, seed: rand() * 100, lit: 0 })

    const satCount = compact ? 3 + Math.floor(rand() * 2) : 4 + Math.floor(rand() * 3)
    const ring: number[] = []
    const offset = rand() * Math.PI * 2

    for (let s = 0; s < satCount; s++) {
      const angle = offset + (s / satCount) * Math.PI * 2 + (rand() - 0.5) * 0.7
      const radius = unit * (0.13 + rand() * 0.17)
      ring.push(nodes.length)
      nodes.push({
        x: ax + Math.cos(angle) * radius,
        y: ay + Math.sin(angle) * radius * 0.85,
        cluster: i,
        hub: false,
        seed: rand() * 100,
        lit: 0,
      })
    }
    rings.push(ring)

    for (const s of ring) edges.push({ a: hubs[i], b: s, trunk: false, elbow: false, grow: 0 })
    for (let s = 0; s < ring.length; s++) {
      if (rand() > 0.45) {
        edges.push({
          a: ring[s],
          b: ring[(s + 1) % ring.length],
          trunk: false,
          elbow: false,
          grow: 0,
        })
      }
    }
  }

  // Trunk: the main line every packet travels, plus a couple of side runs.
  for (let i = 0; i < clusters - 1; i++) {
    edges.push({ a: hubs[i], b: hubs[i + 1], trunk: true, elbow: true, grow: 0 })
    const from = rings[i]
    const to = rings[i + 1]
    const links = compact ? 1 : 2
    for (let k = 0; k < links; k++) {
      edges.push({
        a: from[Math.floor(rand() * from.length)],
        b: to[Math.floor(rand() * to.length)],
        trunk: false,
        elbow: true,
        grow: 0,
      })
    }
  }

  const packets: Packet[] = []
  const packetCount = compact ? 34 : 78
  for (let i = 0; i < packetCount; i++) {
    packets.push({
      edge: Math.floor(rand() * edges.length),
      t: rand(),
      speed: 0.14 + rand() * 0.26,
    })
  }

  return { nodes, edges, packets, worldH }
}

export default function PipelineGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const compact = window.matchMedia('(max-width: 768px)').matches
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let w = window.innerWidth
    let h = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2)
    let graph = buildGraph(w, h, sceneBus.chapterCount, compact)

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      graph = buildGraph(w, h, sceneBus.chapterCount, compact)
    }
    resize()

    const pointer = { x: -9999, y: -9999, active: false }
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
    }

    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerleave', onLeave)
    }
    window.addEventListener('resize', resize)

    const maxScroll = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

    let progress = 0
    let velocity = 0
    let cam = 0
    let last = performance.now()
    let frame = 0
    // Screen positions resolved once per frame and reused by every pass.
    let px = new Float32Array(graph.nodes.length)
    let py = new Float32Array(graph.nodes.length)

    /**
     * Screen-space route for an edge. Inter-cluster runs bend at right angles
     * so the graph reads as a wiring diagram instead of a web of diagonals.
     * Writes x,y pairs into `out` and returns the number of points.
     */
    const route = new Float32Array(8)
    const edgeRoute = (e: Edge, out: Float32Array) => {
      const ax = px[e.a]
      const ay = py[e.a]
      const bx = px[e.b]
      const by = py[e.b]
      out[0] = ax
      out[1] = ay
      if (!e.elbow) {
        out[2] = bx
        out[3] = by
        return 2
      }
      const midY = (ay + by) / 2
      out[2] = ax
      out[3] = midY
      out[4] = bx
      out[5] = midY
      out[6] = bx
      out[7] = by
      return 4
    }

    const routeLength = (out: Float32Array, n: number) => {
      let total = 0
      for (let i = 1; i < n; i++) {
        total += Math.hypot(out[i * 2] - out[i * 2 - 2], out[i * 2 + 1] - out[i * 2 - 1])
      }
      return total
    }

    /** Point at `dist` along the route, written into `hit`. */
    const hit = { x: 0, y: 0 }
    const routePoint = (out: Float32Array, n: number, dist: number) => {
      let left = dist
      for (let i = 1; i < n; i++) {
        const x0 = out[i * 2 - 2]
        const y0 = out[i * 2 - 1]
        const x1 = out[i * 2]
        const y1 = out[i * 2 + 1]
        const len = Math.hypot(x1 - x0, y1 - y0)
        if (left <= len || i === n - 1) {
          const f = len < 0.001 ? 0 : Math.min(1, left / len)
          hit.x = x0 + (x1 - x0) * f
          hit.y = y0 + (y1 - y0) * f
          return
        }
        left -= len
      }
      hit.x = out[0]
      hit.y = out[1]
    }

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      decayPulse(dt)

      if (px.length !== graph.nodes.length) {
        px = new Float32Array(graph.nodes.length)
        py = new Float32Array(graph.nodes.length)
      }

      const next = window.scrollY / maxScroll()
      velocity = Math.min(1, Math.abs(next - progress) * 26 + velocity * 0.86)
      progress = next
      cam = progress * Math.max(0, graph.worldH - h)

      const t = now * 0.001
      const pulse = sceneBus.pulse
      const active = sceneBus.chapter

      ctx.fillStyle = VOID
      ctx.fillRect(0, 0, w, h)

      // Resolve node positions with a slow idle drift and cursor attraction.
      const nodes = graph.nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        let x = n.x + Math.sin(t * 0.5 + n.seed) * 3.5
        let y = n.y - cam + Math.cos(t * 0.42 + n.seed * 1.3) * 3.5

        const onScreen = y > -160 && y < h + 160
        n.lit += ((onScreen ? 1 : 0) - n.lit) * Math.min(1, dt * 3)

        if (pointer.active && onScreen) {
          const dx = pointer.x - x
          const dy = pointer.y - y
          const d = Math.hypot(dx, dy)
          if (d < 260 && d > 0.001) {
            const pullAmount = (1 - d / 260) ** 2 * 14
            x += (dx / d) * pullAmount
            y += (dy / d) * pullAmount
          }
        }
        px[i] = x
        py[i] = y
      }

      // Halo behind the active cluster so the current chapter has a centre of gravity.
      const hubIndex = nodes.findIndex((n) => n.hub && n.cluster === active)
      if (hubIndex >= 0) {
        const hx = px[hubIndex]
        const hy = py[hubIndex]
        if (hy > -h && hy < h * 2) {
          const halo = ctx.createRadialGradient(hx, hy, 0, hx, hy, Math.min(w, h) * 0.62)
          halo.addColorStop(0, rgba(SIGNAL, 0.075 + pulse * 0.05))
          halo.addColorStop(1, rgba(SIGNAL, 0))
          ctx.fillStyle = halo
          ctx.fillRect(0, 0, w, h)
        }
      }

      // Edges — each one draws itself the first time it reaches the viewport.
      const edges = graph.edges
      ctx.lineCap = 'round'
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i]
        const ax = px[e.a]
        const ay = py[e.a]
        const bx = px[e.b]
        const by = py[e.b]
        const midY = (ay + by) / 2
        if (midY > -220 && midY < h + 220 && e.grow < 1) {
          e.grow = Math.min(1, e.grow + dt * 1.5)
        }
        if (e.grow <= 0.001) continue
        if (Math.max(ay, by) < -220 || Math.min(ay, by) > h + 220) continue

        const isActive = nodes[e.a].cluster === active || nodes[e.b].cluster === active
        const base = e.trunk ? 0.3 : 0.14
        const alpha = (isActive ? base * 2.1 : base) + pulse * 0.1
        ctx.strokeStyle = isActive ? rgba(SIGNAL, alpha) : rgba(STEEL, alpha)
        ctx.lineWidth = e.trunk ? 1.4 : 1

        const n = edgeRoute(e, route)
        const total = routeLength(route, n)
        ctx.beginPath()
        ctx.moveTo(route[0], route[1])
        let drawn = e.grow * total
        for (let s = 1; s < n; s++) {
          const x0 = route[s * 2 - 2]
          const y0 = route[s * 2 - 1]
          const x1 = route[s * 2]
          const y1 = route[s * 2 + 1]
          const len = Math.hypot(x1 - x0, y1 - y0)
          if (drawn >= len) {
            ctx.lineTo(x1, y1)
            drawn -= len
          } else {
            const f = len < 0.001 ? 0 : drawn / len
            ctx.lineTo(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f)
            break
          }
        }
        ctx.stroke()

        // Junction marks where a run changes direction.
        if (e.elbow && e.grow > 0.99 && isActive) {
          ctx.fillStyle = rgba(SIGNAL, 0.34)
          for (let s = 1; s < n - 1; s++) {
            ctx.fillRect(route[s * 2] - 1.5, route[s * 2 + 1] - 1.5, 3, 3)
          }
        }
      }

      // Packets — the machine is running even when the user is still.
      const speedScale = 1 + velocity * 4 + pulse * 2.5
      const packets = graph.packets
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i]
        const e = edges[p.edge]
        p.t += p.speed * dt * speedScale
        if (p.t >= 1) {
          p.t -= 1
          // Hop to a neighbouring edge so packets appear to route through the graph.
          const exit = e.b
          for (let tries = 0; tries < 6; tries++) {
            const cand = Math.floor(Math.random() * edges.length)
            if (edges[cand].a === exit || edges[cand].b === exit) {
              p.edge = cand
              break
            }
          }
        }
        if (e.grow < 0.99) continue

        const n = edgeRoute(e, route)
        const total = routeLength(route, n)
        routePoint(route, n, p.t * total)
        const x = hit.x
        const y = hit.y
        if (y < -40 || y > h + 40) continue

        const isActive = nodes[e.a].cluster === active || nodes[e.b].cluster === active
        const colour = isActive ? SIGNAL : LIVE
        routePoint(route, n, Math.max(0, p.t - 0.05) * total)

        ctx.strokeStyle = rgba(colour, isActive ? 0.55 : 0.3)
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(hit.x, hit.y)
        ctx.lineTo(x, y)
        ctx.stroke()

        ctx.fillStyle = rgba(colour, isActive ? 0.95 : 0.6)
        ctx.beginPath()
        ctx.arc(x, y, isActive ? 2.1 : 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      // Nodes — hubs are machines (squares), satellites are ports (dots).
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        if (n.lit < 0.02) continue
        const x = px[i]
        const y = py[i]
        if (y < -60 || y > h + 60) continue

        const isActive = n.cluster === active
        const colour = isActive ? SIGNAL : STEEL
        const alpha = n.lit * (isActive ? 0.95 : 0.42)

        if (n.hub) {
          const size = isActive ? 7 : 5.5
          ctx.strokeStyle = rgba(colour, alpha)
          ctx.lineWidth = 1.3
          ctx.strokeRect(x - size, y - size, size * 2, size * 2)
          if (isActive) {
            // Breathing ring marks the machine that is currently running.
            const ring = 14 + Math.sin(t * 1.6) * 3 + pulse * 16
            ctx.strokeStyle = rgba(SIGNAL, 0.3 * n.lit)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(x, y, ring, 0, Math.PI * 2)
            ctx.stroke()
            ctx.fillStyle = rgba(SIGNAL, 0.5 * n.lit)
            ctx.fillRect(x - 2, y - 2, 4, 4)
          }
        } else {
          ctx.fillStyle = rgba(colour, alpha)
          ctx.beginPath()
          ctx.arc(x, y, isActive ? 2.6 : 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Cursor web — probing the machine wires the nearest ports to your hand.
      if (pointer.active) {
        ctx.lineWidth = 1
        for (let i = 0; i < nodes.length; i++) {
          const x = px[i]
          const y = py[i]
          if (y < -40 || y > h + 40) continue
          const d = Math.hypot(pointer.x - x, pointer.y - y)
          if (d > 240) continue
          const a = (1 - d / 240) ** 2
          ctx.strokeStyle = rgba(SIGNAL, a * 0.4)
          ctx.beginPath()
          ctx.moveTo(pointer.x, pointer.y)
          ctx.lineTo(x, y)
          ctx.stroke()
          ctx.fillStyle = rgba(SIGNAL, a * 0.8)
          ctx.beginPath()
          ctx.arc(x, y, 1.5 + a * 2.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      const vignette = ctx.createRadialGradient(
        w / 2,
        h * 0.45,
        Math.min(w, h) * 0.28,
        w / 2,
        h * 0.45,
        Math.max(w, h) * 0.82,
      )
      vignette.addColorStop(0, 'rgba(0,0,0,0)')
      vignette.addColorStop(1, 'rgba(0,0,0,0.62)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, w, h)

      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  )
}
