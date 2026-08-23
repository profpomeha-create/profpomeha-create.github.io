import { useLayoutEffect, useRef } from 'react'
import { Magnetic } from '~/components/Magnetic'
import { site } from '~/content/site'

/** Terminal block schematic — the point where an external line joins the shop. */
function TerminalBlock({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg
      ref={svgRef}
      className="contact-terminal flex-none"
      viewBox="0 0 132 84"
      width="132"
      height="84"
      aria-hidden="true"
    >
      <rect
        className="terminal-stroke"
        x="34"
        y="10"
        width="64"
        height="64"
        stroke="var(--hairline-hi)"
        strokeWidth="1.2"
      />
      {[26, 42, 58].map((y) => (
        <path
          key={`in-${y}`}
          className="terminal-stroke"
          d={`M2 ${y} H34`}
          stroke="var(--signal)"
          strokeWidth="1.2"
        />
      ))}
      {[26, 42, 58].map((y) => (
        <path
          key={`out-${y}`}
          className="terminal-stroke"
          d={`M98 ${y} H130`}
          stroke="var(--signal)"
          strokeWidth="1.2"
        />
      ))}
      {[26, 42, 58].map((y) => (
        <circle
          key={`pin-${y}`}
          className="terminal-stroke"
          cx="66"
          cy={y}
          r="5"
          stroke="var(--signal)"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  )
}

export function Contact() {
  const svg = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const root = svg.current
    if (!root) return
    root.querySelectorAll<SVGGeometryElement>('.terminal-stroke').forEach((path) => {
      const len = path.getTotalLength()
      path.style.strokeDasharray = `${len}`
      path.style.strokeDashoffset = `${len}`
    })
  }, [])

  return (
    <section id="contact" className="chapter flex flex-col justify-end pb-[clamp(2.5rem,6vw,4rem)]" aria-labelledby="contact-title">
      <div className="bay-head">
        <span className="tag tag-signal">05</span>
        <span className="tag">подключение</span>
      </div>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-10 pt-16">
        <div>
          <h2 id="contact-title" className="contact-title plate plate-lg max-w-[18ch]">
            Готовы обсудить архитектуру?
          </h2>
          <p className="mt-5 max-w-[42ch] text-[length:var(--step-00)] leading-relaxed text-muted">
            Спроектирую инфраструктуру, CI/CD или масштабируемый сервис. Напишите — разберём контур и посчитаем архитектуру.
          </p>
        </div>
        <TerminalBlock svgRef={svg} />
      </div>

      <nav className="mt-14 flex flex-wrap gap-3" aria-label="Контакты">
        <Magnetic as="a" href={`mailto:${site.email}`} label="Написать" className="link-plate mono text-[length:var(--step-00)]">
          <span className="led led-signal relative z-[1]" />
          <span className="relative z-[1]">{site.email}</span>
        </Magnetic>
        <Magnetic
          as="a"
          href={site.telegram}
          rel="noreferrer"
          target="_blank"
          label="Telegram"
          className="link-plate mono text-[length:var(--step-00)]"
        >
          <span className="led led-signal relative z-[1]" />
          <span className="relative z-[1]">Telegram</span>
        </Magnetic>
        <Magnetic
          as="a"
          href={site.github}
          rel="noreferrer"
          target="_blank"
          label="GitHub"
          className="link-plate mono text-[length:var(--step-00)]"
        >
          <span className="led led-signal relative z-[1]" />
          <span className="relative z-[1]">GitHub</span>
        </Magnetic>
      </nav>
    </section>
  )
}
