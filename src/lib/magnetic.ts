import gsap from 'gsap'
import { useEffect, type RefObject } from 'react'

export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.35) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.38, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.38, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      xTo((e.clientX - cx) * strength)
      yTo((e.clientY - cy) * strength)
    }

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.72, ease: 'elastic.out(1, 0.42)' })
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [ref, strength])
}
