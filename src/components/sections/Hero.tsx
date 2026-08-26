import { BrandLockup } from '~/components/Brand'
import { Magnetic } from '~/components/Magnetic'
import { kpis, site } from '~/content/site'
import { scrollToSection } from '~/lib/lenis'

export function Hero() {
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
        <h1 id="hero-title" className="hero-title">
          <span className="sr-only">{site.seo.title}</span>
          <BrandLockup className="hero-logo" />
        </h1>
        <p className="hero-line mt-6 max-w-[28ch] text-[length:var(--step-2)] font-semibold tracking-[-0.03em]">
          {site.subtitle}
        </p>
        <p className="hero-line mt-4 max-w-[50ch] text-[length:var(--step-00)] leading-relaxed text-muted">
          {site.lead}
        </p>
        <div className="hero-line mt-7 flex flex-wrap items-center gap-3">
          <Magnetic
            as="button"
            type="button"
            label={site.ctaPrimary}
            className="link-plate link-plate-fill mono text-[length:var(--step-00)]"
            onClick={() => scrollToSection('#contact')}
          >
            <span className="led led-signal relative z-[1]" />
            <span className="relative z-[1]">{site.ctaPrimary}</span>
          </Magnetic>
          <Magnetic
            as="button"
            type="button"
            label={site.ctaSecondary}
            className="link-plate mono text-[length:var(--step-00)]"
            onClick={() => scrollToSection('#cases')}
          >
            <span className="led relative z-[1]" />
            <span className="relative z-[1]">{site.ctaSecondary}</span>
          </Magnetic>
        </div>
        <p className="hero-line mt-3 max-w-[46ch] text-[length:var(--step-000)] leading-relaxed text-faint">
          {site.ctaHint}
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
