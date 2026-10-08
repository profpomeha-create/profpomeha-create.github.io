import { useEffect, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { BrandMark } from '~/components/Brand'
import { CustomCursor, ScrollProgress } from '~/components/Chrome'
import { Magnetic } from '~/components/Magnetic'
import { services } from '~/content/services'
import { products, site } from '~/content/site'

export type Crumb = {
  label: string
  to?: string
}

export function PageShell({
  crumbs,
  children,
  cta = true,
}: {
  crumbs: Crumb[]
  children: ReactNode
  cta?: boolean
}) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative">
      <div className="blueprint" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <ScrollProgress brand={false} />
      <CustomCursor />
      <header className="page-bar">
        <Magnetic as={Link} to="/" label={site.name} className="flex items-center gap-2.5">
          <BrandMark className="h-6 w-auto" />
          <span className="tag">
            {site.name} · {site.kicker}
          </span>
        </Magnetic>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Разделы">
          <Magnetic as={Link} to="/" label="Пульт" className="tag">
            Пульт
          </Magnetic>
          <Magnetic as={Link} to="/uslugi" label="Услуги" className="tag">
            Услуги
          </Magnetic>
          <Magnetic as={Link} to="/keysy" label="Кейсы" className="tag">
            Кейсы
          </Magnetic>
        </nav>
        {cta ? (
          <Magnetic
            as="a"
            href="#brief"
            label={site.ctaPrimary}
            className="link-plate link-plate-fill mono ml-auto text-[length:var(--step-000)]"
          >
            <span className="led led-signal relative z-[1]" />
            <span className="relative z-[1]">{site.ctaPrimary}</span>
          </Magnetic>
        ) : null}
      </header>
      <main className="relative z-[2]">
        {crumbs.length ? (
          <nav
            aria-label="Навигация по разделам"
            className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center gap-2 px-[var(--gutter)] pt-[clamp(4.75rem,11vw,6.25rem)]"
          >
            {crumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                {i > 0 ? <span className="tag">/</span> : null}
                {crumb.to ? (
                  <Link to={crumb.to} className="tag">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="tag tag-signal">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        {children}
      </main>
      <footer className="relative z-[2] px-[var(--gutter)] pb-[clamp(2.5rem,6vw,4rem)]">
        <nav className="mt-4 flex flex-wrap gap-3" aria-label="Контакты и разделы">
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
          <Magnetic as={Link} to="/uslugi" label="Услуги" className="link-plate mono text-[length:var(--step-00)]">
            <span className="led relative z-[1]" />
            <span className="relative z-[1]">Услуги</span>
          </Magnetic>
          <Magnetic as={Link} to="/keysy" label="Кейсы" className="link-plate mono text-[length:var(--step-00)]">
            <span className="led relative z-[1]" />
            <span className="relative z-[1]">Кейсы</span>
          </Magnetic>
        </nav>

        <div className="mt-10 border-t border-[var(--hairline)] pt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="tag tag-signal mb-3">Направления</p>
            <ul className="flex flex-col gap-2">
              {services.map((svc) => (
                <li key={svc.slug}>
                  <Link
                    to="/uslugi/$slug"
                    params={{ slug: svc.slug }}
                    className="text-[length:var(--step-000)] text-muted hover:text-signal transition-colors"
                  >
                    {svc.name} · {svc.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="tag tag-signal mb-3">Кейсы</p>
            <ul className="flex flex-col gap-2">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/keysy/$slug"
                    params={{ slug: p.slug }}
                    className="text-[length:var(--step-000)] text-muted hover:text-signal transition-colors"
                  >
                    {p.name} — {p.effect}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="tag tag-signal mb-3">Студия</p>
            <p className="text-[length:var(--step-000)] text-muted leading-relaxed">
              {site.name} — {site.seo.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="tag">партнёр</span>
              <Magnetic
                as="a"
                href={site.getsaldo}
                rel="noreferrer"
                target="_blank"
                label="GetSaldo"
                className="link-plate mono text-[length:var(--step-000)]"
              >
                <span className="led led-signal relative z-[1]" />
                <span className="relative z-[1]">GetSaldo</span>
              </Magnetic>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--hairline)] pt-6 flex flex-wrap items-center justify-between gap-4 text-[length:var(--step-000)] text-faint">
          <p>© {new Date().getFullYear()} {site.name}. Все контуры в работе.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy" className="hover:text-signal transition-colors">
              Политика конфиденциальности и Cookies
            </Link>
            <a
              href="https://yandex.ru/legal/metrica_termsofuse/ru/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-signal transition-colors"
            >
              Условия сервиса «Яндекс Метрика» ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <PageShell crumbs={[{ label: site.name, to: '/' }]} cta={false}>
      <section className="chapter-fit flex min-h-[70svh] flex-col justify-center page-hero">
        <div className="bay-head">
          <span className="tag tag-signal">404</span>
          <span className="tag">нет такого адреса</span>
        </div>
        <h1 className="plate plate-md mt-10 max-w-[16ch]">Страница не найдена</h1>
        <p className="mt-6 max-w-[46ch] text-[length:var(--step-00)] leading-relaxed text-muted">
          Адрес не совпал с пультом, услугой или кейсом. Вернитесь на главную или выберите направление.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Magnetic as={Link} to="/" label="На пульт" className="link-plate link-plate-fill mono text-[length:var(--step-00)]">
            <span className="led led-signal relative z-[1]" />
            <span className="relative z-[1]">На пульт</span>
          </Magnetic>
          <Magnetic as={Link} to="/uslugi" label="Услуги" className="link-plate mono text-[length:var(--step-00)]">
            <span className="led relative z-[1]" />
            <span className="relative z-[1]">Услуги</span>
          </Magnetic>
        </div>
      </section>
    </PageShell>
  )
}
