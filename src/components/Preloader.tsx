import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { bootLines, site } from '~/content/site'

export function Preloader({
  reduced,
  onDone,
}: {
  reduced: boolean
  onDone: () => void
}) {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (reduced) {
        onDone()
        return
      }
      const counter = { v: 0 }
      gsap.set('.boot-bar', { scaleX: 0 })
      gsap.set('.boot-line', { opacity: 0, x: -8 })
      const tl = gsap.timeline({ onComplete: onDone })

      tl.to('.boot-line', {
        opacity: 1,
        x: 0,
        duration: 0.28,
        stagger: 0.16,
        ease: 'power2.out',
      })
      tl.to(
        '.boot-bar',
        { scaleX: 1, duration: 1.5, ease: 'power2.inOut' },
        0,
      )
      tl.to(
        counter,
        {
          v: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (num.current) {
              num.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
            }
          },
        },
        0,
      )
      // Hand-off: the log clears, then the shutter lifts on a running machine.
      tl.to('.boot-fade', { opacity: 0, duration: 0.3, ease: 'power2.in' }, '+=0.15')
      tl.to(root.current, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, '-=0.1')
    },
    { scope: root },
  )

  if (reduced) return null

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[70] flex flex-col justify-between bg-[var(--void-deep)] px-[var(--gutter)] py-[clamp(1.5rem,4vw,3rem)]"
    >
      <div className="boot-fade flex items-center gap-3">
        <span className="led led-signal led-blink" />
        <span className="tag">{site.name} · {site.kicker}</span>
      </div>

      <ul className="boot-fade space-y-2">
        {bootLines.map((line) => (
          <li
            key={line}
            className="boot-line mono flex items-center gap-3 text-[length:var(--step-00)] text-muted"
          >
            <span className="text-signal">›</span>
            {line}
          </li>
        ))}
      </ul>

      <div className="boot-fade">
        <div className="mb-4 h-px w-full bg-[var(--hairline)]">
          <div className="boot-bar w-full origin-left" />
        </div>
        <div className="flex items-baseline justify-between gap-6">
          <span className="tag">запуск контура</span>
          <span ref={num} className="mono text-signal text-[length:var(--step-4)] leading-none tabular-nums">
            000
          </span>
        </div>
      </div>
    </div>
  )
}
