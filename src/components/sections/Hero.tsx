import { Magnetic } from '~/components/Magnetic'
import { scrollToSection } from '~/lib/lenis'
import { kpis, site } from '~/content/site'

export function SplitChars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={`${ch}-${i}`} className="char inline-block will-change-transform">
          {ch === ' ' ? '\u00a0' : ch}
        </span>
      ))}
    </>
  )
}

export function Hero() {
  const [first, ...rest] = site.name.split(' ')
  const surname = rest.join(' ')

  return (
    <section
      id="hero"
      className="chapter chapter-hero flex min-h-svh flex-col justify-between gap-6"
      aria-labelledby="hero-title"
    >
      <div className="hero-line flex items-center gap-3">
        <span className="led led-on led-blink" />
        <span className="tag">{site.kicker}</span>
      </div>

      <div>
        <h1 id="hero-title" className="hero-title plate plate-hero">
          <span className="sr-only">{site.name}</span>
          <span aria-hidden="true">
            <span className="-mt-[0.18em] block overflow-hidden pt-[0.18em]">
              <SplitChars text={first} />
            </span>
            <span className="-mt-[0.18em] block overflow-hidden pt-[0.18em] text-signal">
              <SplitChars text={surname} />
            </span>
          </span>
        </h1>
        <p className="hero-line mt-6 max-w-[32ch] text-[length:var(--step-2)] font-semibold tracking-[-0.03em]">
          {site.subtitle}
        </p>
        <p className="hero-line mt-4 max-w-[50ch] text-[length:var(--step-00)] leading-relaxed text-muted">
          {site.lead}
        </p>
      </div>

      <ul className="product-rail grid grid-cols-1 gap-px bg-[var(--hairline)] sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <li key={item.id}>
            <Magnetic
              as="button"
              type="button"
              label={item.value}
              strength={0.28}
              className="kpi-tile product-tile panel panel-live flex h-full w-full flex-col items-start p-5 text-left md:p-6"
              onClick={() => scrollToSection('#cases')}
            >
              <span className="flex items-center gap-3">
                <span className="led led-on" />
                <span className="tag tag-signal">{item.code}</span>
              </span>
              <span className="mono mt-4 text-signal text-[length:var(--step-3)] leading-none">{item.value}</span>
              <span className="mt-3 text-[length:var(--step-00)] leading-relaxed text-muted">{item.label}</span>
            </Magnetic>
          </li>
        ))}
      </ul>
    </section>
  )
}
