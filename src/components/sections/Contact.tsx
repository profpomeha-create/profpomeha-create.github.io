import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { Magnetic } from '~/components/Magnetic'
import { briefNeeds, contactCopy, site } from '~/content/site'
import { usePrefersReducedMotion } from '~/lib/motion'

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

function SpiderLeg({
  x,
  y,
  d,
}: {
  x: number
  y: number
  d: string
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="spider-step">
        <path d={d} />
      </g>
    </g>
  )
}

function SpiderMark({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg
      ref={svgRef}
      className="contact-spider"
      viewBox="0 0 88 88"
      width="88"
      height="88"
      aria-hidden="true"
    >
      <SpiderLeg x={36} y={22} d="M0 0 L-16 -12 L-32 -8" />
      <SpiderLeg x={33} y={30} d="M0 0 L-18 -4 L-34 4" />
      <SpiderLeg x={33} y={40} d="M0 0 L-18 6 L-34 4" />
      <SpiderLeg x={36} y={48} d="M0 0 L-14 14 L-28 26" />
      <SpiderLeg x={52} y={22} d="M0 0 L16 -12 L32 -8" />
      <SpiderLeg x={55} y={30} d="M0 0 L18 -4 L34 4" />
      <SpiderLeg x={55} y={40} d="M0 0 L18 6 L34 4" />
      <SpiderLeg x={52} y={48} d="M0 0 L14 14 L28 26" />
      <ellipse cx="44" cy="50" rx="11" ry="14" />
      <circle cx="44" cy="28" r="9" />
      <circle className="spider-eye" cx="40" cy="26" r="1.4" />
      <circle className="spider-eye" cx="48" cy="26" r="1.4" />
    </svg>
  )
}

function walkLegs(bug: SVGSVGElement) {
  return [...bug.querySelectorAll<SVGGElement>('.spider-step')].map((leg, i) => {
    const proxy = { a: i % 2 === 0 ? -40 : 40 }
    return gsap.to(proxy, {
      a: i % 2 === 0 ? 40 : -40,
      duration: 0.09,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: (i % 4) * 0.025,
      onUpdate: () => {
        leg.setAttribute('transform', `rotate(${proxy.a})`)
      },
    })
  })
}

function heading(from: { x: number; y: number }, to: { x: number; y: number }) {
  return (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI + 90
}

function mix(
  a: { x: number; y: number },
  b: { x: number; y: number },
  t: number,
) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

function scramblePath(start: { x: number; y: number }, vw: number, vh: number) {
  const pad = 90
  const edge = gsap.utils.random(['left', 'right', 'top', 'bottom']) as
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
  const exit =
    edge === 'left'
      ? { x: -pad, y: gsap.utils.random(pad, vh - pad) }
      : edge === 'right'
        ? { x: vw + pad, y: gsap.utils.random(pad, vh - pad) }
        : edge === 'top'
          ? { x: gsap.utils.random(pad, vw - pad), y: -pad }
          : { x: gsap.utils.random(pad, vw - pad), y: vh + pad }

  const dx = exit.x - start.x
  const dy = exit.y - start.y
  const len = Math.hypot(dx, dy) || 1
  const px = (-dy / len) * gsap.utils.random(70, 160)
  const py = (dx / len) * gsap.utils.random(70, 160)
  const sign = gsap.utils.random([-1, 1]) as 1 | -1

  const p1 = mix(start, exit, gsap.utils.random(0.22, 0.36))
  p1.x += px * sign
  p1.y += py * sign
  const p2 = mix(start, exit, gsap.utils.random(0.52, 0.7))
  p2.x -= px * sign * 0.7
  p2.y -= py * sign * 0.7

  return { p1, p2, exit }
}

type Brief = {
  name: string
  company: string
  need: string
  message: string
  contact: string
}

const emptyBrief: Brief = { name: '', company: '', need: '', message: '', contact: '' }

function validateBrief(data: Brief) {
  const errors: Partial<Record<keyof Brief, string>> = {}
  if (data.name.trim().length < 2) errors.name = 'Укажите имя'
  if (!data.need) errors.need = 'Выберите направление'
  if (data.message.trim().length < 12) errors.message = 'Коротко опишите задачу'
  if (data.contact.trim().length < 4) errors.contact = 'Укажите почту, телефон или мессенджер'
  return errors
}

function buildMailto(data: Brief) {
  const needLabel = briefNeeds.find((item) => item.id === data.need)?.label ?? data.need
  const subject = encodeURIComponent(`Запрос: ${needLabel} — ${data.company || data.name}`)
  const body = encodeURIComponent(
    [
      `Имя: ${data.name}`,
      `Компания: ${data.company || '—'}`,
      `Что нужно: ${needLabel}`,
      `Контакт для ответа: ${data.contact}`,
      '',
      'Задача:',
      data.message,
    ].join('\n'),
  )
  return `mailto:${site.email}?subject=${subject}&body=${body}`
}

function BriefForm() {
  const [data, setData] = useState<Brief>(emptyBrief)
  const [errors, setErrors] = useState<Partial<Record<keyof Brief, string>>>({})
  const [sent, setSent] = useState(false)
  const [href, setHref] = useState('')

  const set =
    (key: keyof Brief) =>
    (event: { target: { value: string } }) => {
      setData((prev) => ({ ...prev, [key]: event.target.value }))
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
    }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = validateBrief(data)
    setErrors(next)
    if (Object.keys(next).length) return
    const mail = buildMailto(data)
    setHref(mail)
    setSent(true)
    window.location.href = mail
  }

  if (sent) {
    return (
      <div className="brief-done panel p-8" role="status">
        <p className="tag tag-signal">заявка собрана</p>
        <p className="mt-5 max-w-[42ch] text-[length:var(--step-00)] leading-relaxed text-muted">
          Откроется почтовый клиент с заполненным письмом. Если этого не произошло, отправьте его вручную.
        </p>
        <Magnetic as="a" href={href} label="Открыть письмо" className="link-plate link-plate-fill mono mt-6 text-[length:var(--step-00)]">
          <span className="led led-signal relative z-[1]" />
          <span className="relative z-[1]">Открыть письмо</span>
        </Magnetic>
      </div>
    )
  }

  return (
    <form id="brief" className="brief-form" onSubmit={onSubmit} noValidate>
      <div className="brief-grid">
        <label className="brief-field">
          <span className="tag">Имя</span>
          <input
            className="brief-input"
            name="name"
            autoComplete="name"
            value={data.name}
            onChange={set('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'brief-name-error' : undefined}
          />
          {errors.name ? (
            <span id="brief-name-error" className="brief-error">
              {errors.name}
            </span>
          ) : null}
        </label>
        <label className="brief-field">
          <span className="tag">Компания</span>
          <input
            className="brief-input"
            name="company"
            autoComplete="organization"
            value={data.company}
            onChange={set('company')}
          />
        </label>
        <label className="brief-field">
          <span className="tag">Что нужно</span>
          <select
            className="brief-input"
            name="need"
            value={data.need}
            onChange={set('need')}
            aria-invalid={Boolean(errors.need)}
            aria-describedby={errors.need ? 'brief-need-error' : undefined}
          >
            <option value="">Выберите направление</option>
            {briefNeeds.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.need ? (
            <span id="brief-need-error" className="brief-error">
              {errors.need}
            </span>
          ) : null}
        </label>
        <label className="brief-field">
          <span className="tag">Контакт для ответа</span>
          <input
            className="brief-input"
            name="reply"
            autoComplete="email"
            value={data.contact}
            onChange={set('contact')}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? 'brief-contact-error' : undefined}
          />
          {errors.contact ? (
            <span id="brief-contact-error" className="brief-error">
              {errors.contact}
            </span>
          ) : null}
        </label>
      </div>
      <label className="brief-field mt-4">
        <span className="tag">Короткое описание задачи</span>
        <textarea
          className="brief-input brief-area"
          name="message"
          rows={4}
          value={data.message}
          onChange={set('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'brief-message-error' : undefined}
        />
        {errors.message ? (
          <span id="brief-message-error" className="brief-error">
            {errors.message}
          </span>
        ) : null}
      </label>
      <Magnetic
        as="button"
        type="submit"
        label={contactCopy.submit}
        className="link-plate link-plate-fill mono mt-6 text-[length:var(--step-00)]"
      >
        <span className="led led-signal relative z-[1]" />
        <span className="relative z-[1]">{contactCopy.submit}</span>
      </Magnetic>
    </form>
  )
}

export function Contact() {
  const svg = useRef<SVGSVGElement>(null)
  const spider = useRef<SVGSVGElement>(null)
  const run = useRef<gsap.core.Timeline | null>(null)
  const gait = useRef<gsap.core.Tween[]>([])
  const busy = useRef(false)
  const reduced = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useLayoutEffect(() => {
    const root = svg.current
    if (!root) return
    root.querySelectorAll<SVGGeometryElement>('.terminal-stroke').forEach((path) => {
      const len = path.getTotalLength()
      path.style.strokeDasharray = `${len}`
      path.style.strokeDashoffset = `${len}`
    })
  }, [])

  useEffect(
    () => () => {
      run.current?.kill()
      gait.current.forEach((tw) => tw.kill())
    },
    [],
  )

  const restoreTerminal = () => {
    const strokes = svg.current?.querySelectorAll<SVGGeometryElement>('.terminal-stroke')
    if (!strokes?.length) return
    gsap.to(strokes, {
      strokeDashoffset: 0,
      duration: 0.85,
      stagger: 0.05,
      ease: 'power2.inOut',
    })
  }

  const flee = () => {
    if (reduced || busy.current) return
    const terminal = svg.current
    const bug = spider.current
    if (!terminal || !bug) return

    busy.current = true
    run.current?.kill()
    gait.current.forEach((tw) => tw.kill())

    const box = terminal.getBoundingClientRect()
    const start = { x: box.left + box.width / 2, y: box.top + box.height / 2 }
    const { p1, p2, exit } = scramblePath(start, window.innerWidth, window.innerHeight)

    const strokes = terminal.querySelectorAll<SVGGeometryElement>('.terminal-stroke')

    gsap.set(bug, {
      x: start.x,
      y: start.y,
      xPercent: -50,
      yPercent: -50,
      rotation: heading(start, p1),
      scale: 0.35,
      autoAlpha: 0,
    })

    const tl = gsap.timeline({
      onComplete: () => {
        gait.current.forEach((tw) => tw.kill())
        gait.current = []
        gsap.set(bug, { autoAlpha: 0 })
        restoreTerminal()
        busy.current = false
      },
    })
    run.current = tl

    tl.to(
      strokes,
      {
        strokeDashoffset: (_i, el) => (el as SVGGeometryElement).getTotalLength(),
        duration: 0.28,
        stagger: 0.018,
        ease: 'power2.in',
      },
      0,
    )
    tl.to(
      bug,
      { autoAlpha: 1, scale: 1, duration: 0.22, ease: 'back.out(2.2)' },
      0.12,
    )
    tl.add(() => {
      gait.current = walkLegs(bug)
    }, 0.12)
    tl.to(bug, {
      x: p1.x,
      y: p1.y,
      rotation: heading(start, p1),
      duration: 0.28,
      ease: 'power1.in',
    })
    tl.to(bug, {
      x: p2.x,
      y: p2.y,
      rotation: heading(p1, p2),
      duration: 0.34,
      ease: 'none',
    })
    tl.to(bug, {
      x: exit.x,
      y: exit.y,
      rotation: heading(p2, exit),
      duration: 0.58,
      ease: 'power2.in',
    })
  }

  return (
    <section id="contact" className="chapter flex flex-col justify-end pb-[clamp(2.5rem,6vw,4rem)]" aria-labelledby="contact-title">
      <div className="bay-head">
        <span className="tag tag-signal">06</span>
        <span className="tag">подключение</span>
      </div>

      <div className="mt-auto grid grid-cols-1 items-end gap-12 pt-16 lg:grid-cols-[minmax(0,1.4fr)_auto]">
        <div>
          <h2 id="contact-title" className="contact-title plate plate-lg max-w-[18ch]">
            {contactCopy.title}
          </h2>
          <p className="mt-5 max-w-[46ch] text-[length:var(--step-00)] leading-relaxed text-muted">
            {contactCopy.lead}
          </p>
          <div className="mt-10">
            <BriefForm />
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <button
            type="button"
            className="contact-terminal-hit"
            data-cursor-label={contactCopy.terminalLabel}
            aria-label={contactCopy.terminalLabel}
            onPointerEnter={flee}
          >
            <TerminalBlock svgRef={svg} />
          </button>
          <p className="tag max-w-[22ch] text-right">{contactCopy.terminalLabel}</p>
        </div>
      </div>

      <nav className="mt-14 flex flex-wrap gap-3" aria-label="Дополнительные контакты">
        <Magnetic as="a" href={`mailto:${site.email}`} label="Написать" className="link-plate mono text-[length:var(--step-00)]">
          <span className="led led-signal relative z-[1]" />
          <span className="relative z-[1]">{site.email}</span>
        </Magnetic>
        {site.telegram ? (
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
        ) : null}
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

      <p className="mt-10 flex flex-wrap items-center gap-3">
        <span className="tag">при поддержке</span>
        <Magnetic
          as="a"
          href={site.getsaldo}
          rel="noreferrer"
          target="_blank"
          label="GetSaldo"
          className="link-plate mono text-[length:var(--step-00)]"
        >
          <span className="led led-signal relative z-[1]" />
          <span className="relative z-[1]">GetSaldo</span>
        </Magnetic>
      </p>

      {mounted
        ? createPortal(<SpiderMark svgRef={spider} />, document.body)
        : null}
    </section>
  )
}
