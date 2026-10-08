import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { BrandMark } from '~/components/Brand'
import { site } from '~/content/site'
import { resetTabProgress, setTabProgress } from '~/lib/tabProgress'

function readProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}

/** Top hairline plus a numeric readout — a gauge, not a decorative bar. */
export function ScrollProgress({ brand = true }: { brand?: boolean }) {
  const bar = useRef<HTMLDivElement>(null)
  const readout = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame = 0
    const apply = (p: number) => {
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
      if (readout.current) {
        readout.current.textContent = `${String(Math.round(p * 100)).padStart(3, '0')}%`
      }
      setTabProgress(p)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        apply(readProgress())
      })
    }
    apply(readProgress())
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      resetTabProgress()
    }
  }, [])

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px bg-[var(--hairline)]"
        aria-hidden="true"
      >
        <div
          ref={bar}
          className="h-full origin-left bg-signal shadow-[0_0_12px_var(--signal-glow)]"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
      <div
        className="pointer-events-none fixed top-[clamp(1rem,2.4vw,1.8rem)] right-[var(--gutter)] z-50 flex items-center gap-3"
        aria-hidden="true"
      >
        <span className="led led-on led-blink" />
        <span ref={readout} className="mono text-signal text-[10px] tracking-[0.22em] tabular-nums">
          000%
        </span>
      </div>
      {brand ? (
        <div
          className="pointer-events-none fixed top-[clamp(1rem,2.4vw,1.8rem)] left-[var(--gutter)] z-50 hidden md:block"
          aria-hidden="true"
        >
          <span className="flex items-center gap-2.5">
            <BrandMark className="h-6 w-auto" />
            <span className="tag">{site.name} · {site.kicker}</span>
          </span>
        </div>
      ) : null}
    </>
  )
}

/** Reticle cursor: the visitor is operating an instrument, not browsing a page. */
export function CustomCursor() {
  const root = useRef<HTMLDivElement>(null)
  const reticle = useRef<HTMLDivElement>(null)
  const labelEl = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    const el = reticle.current
    const wrap = root.current
    const label = labelEl.current
    if (!el || !wrap || !label) return

    document.body.classList.add('has-cursor')

    const xTo = gsap.quickTo(el, 'x', { duration: 0.14, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.14, ease: 'power3.out' })
    const lxTo = gsap.quickTo(label, 'x', { duration: 0.26, ease: 'power2.out' })
    const lyTo = gsap.quickTo(label, 'y', { duration: 0.26, ease: 'power2.out' })

    const move = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      lxTo(e.clientX)
      lyTo(e.clientY)
    }

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.('[data-cursor-label]')
      const text = target?.getAttribute('data-cursor-label')
      if (text) {
        label.textContent = text
        wrap.classList.add('is-hot')
      }
    }

    const onOut = (e: PointerEvent) => {
      const next = e.relatedTarget as HTMLElement | null
      if (next?.closest?.('[data-cursor-label]')) return
      wrap.classList.remove('is-hot')
      label.textContent = ''
    }

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)

    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
    }
  }, [])

  return (
    <div
      ref={root}
      className="cursor-root pointer-events-none fixed inset-0 z-[10000] hidden md:block"
      aria-hidden="true"
    >
      <div ref={reticle} className="cursor-reticle">
        <span className="cursor-box" />
        <span className="cursor-arm cursor-arm-x" />
        <span className="cursor-arm cursor-arm-y" />
      </div>
      <span ref={labelEl} className="cursor-label" />
    </div>
  )
}
