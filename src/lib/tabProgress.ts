const VOID = '#121316'
const SIGNAL = '#f2a13a'
const TRACK = 'rgba(242, 161, 58, 0.28)'
const LIVE = '#35d68a'

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let icon: HTMLLinkElement | null = null
let originalHref = ''
let originalType = ''
let lastKey = ''

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  context.beginPath()
  context.moveTo(x + radius, y)
  context.arcTo(x + w, y, x + w, y + h, radius)
  context.arcTo(x + w, y + h, x, y + h, radius)
  context.arcTo(x, y + h, x, y, radius)
  context.arcTo(x, y, x + w, y, radius)
  context.closePath()
}

function tick(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  dx: number,
  dy: number,
  len: number,
) {
  context.beginPath()
  context.moveTo(x, y)
  context.lineTo(x + dx * len, y)
  context.moveTo(x, y)
  context.lineTo(x, y + dy * len)
  context.stroke()
}

/** Oscilloscope pulse that travels left → right. Position, not a count. */
function scope(p: number, n = 13) {
  const pos = p * (n - 1)
  return Array.from({ length: n }, (_, i) => {
    const d = Math.abs(i - pos)
    if (d < 0.45) return '█'
    if (d < 1.05) return '▆'
    if (d < 1.75) return '▃'
    return '·'
  }).join('')
}

function paint(p: number) {
  if (!ctx || !canvas) return ''

  const s = canvas.width
  const k = s / 32
  const cx = s / 2
  const cy = s / 2
  const radius = 9.2 * k
  const done = p >= 0.995
  const ink = done ? LIVE : SIGNAL
  const angle = -Math.PI / 2 + p * Math.PI * 2

  ctx.clearRect(0, 0, s, s)

  roundRect(ctx, 0, 0, s, s, 6 * k)
  ctx.fillStyle = VOID
  ctx.fill()

  ctx.strokeStyle = ink
  ctx.lineWidth = 1.4 * k
  ctx.lineCap = 'square'
  const t = 5 * k
  tick(ctx, 6.5 * k, 6.5 * k, 1, 1, t)
  tick(ctx, 25.5 * k, 6.5 * k, -1, 1, t)
  tick(ctx, 6.5 * k, 25.5 * k, 1, -1, t)
  tick(ctx, 25.5 * k, 25.5 * k, -1, -1, t)

  ctx.beginPath()
  ctx.moveTo(cx - radius, cy)
  ctx.lineTo(cx + radius, cy)
  ctx.moveTo(cx, cy - radius)
  ctx.lineTo(cx, cy + radius)
  ctx.strokeStyle = TRACK
  ctx.lineWidth = 1.1 * k
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = TRACK
  ctx.lineWidth = 2.2 * k
  ctx.stroke()

  if (p > 0.008) {
    ctx.beginPath()
    ctx.arc(cx, cy, radius, -Math.PI / 2, angle)
    ctx.strokeStyle = ink
    ctx.lineWidth = 2.4 * k
    ctx.lineCap = 'butt'
    ctx.stroke()
  }

  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
  ctx.strokeStyle = ink
  ctx.lineWidth = 1.7 * k
  ctx.lineCap = 'square'
  ctx.stroke()

  ctx.fillStyle = ink
  const pip = (done ? 2.2 : 1.7) * k
  ctx.fillRect(cx - pip / 2, cy - pip / 2, pip, pip)

  return canvas.toDataURL('image/png')
}

function ensureIcon() {
  if (icon?.isConnected) return icon
  const existing = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (existing) {
    if (!originalHref) {
      originalHref = existing.href
      originalType = existing.type
    }
    icon = existing
    return icon
  }
  icon = document.createElement('link')
  icon.rel = 'icon'
  document.head.appendChild(icon)
  return icon
}

export function setTabProgress(progress: number) {
  const p = Math.min(1, Math.max(0, progress))
  const tape = scope(p)
  const key = `${tape}:${Math.round(p * 48)}`
  if (key === lastKey) return
  lastKey = key

  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.width = 96
    canvas.height = 96
    ctx = canvas.getContext('2d')
  }

  const link = ensureIcon()
  link.type = 'image/png'
  link.href = paint(p)
}

export function resetTabProgress() {
  lastKey = ''
  if (icon && originalHref) {
    icon.type = originalType || 'image/png'
    icon.href = originalHref
  }
}
