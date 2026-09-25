import { Link } from '@tanstack/react-router'
import { BriefForm } from '~/components/BriefForm'
import { Magnetic } from '~/components/Magnetic'
import { PageShell } from '~/components/PageShell'
import { contactCopy, site, stack } from '~/content/site'
import { services, type Service } from '~/content/services'
import { productById } from '~/content/catalog'

export function ServicePage({ service }: { service: Service }) {
  const related = productById(service.relatedCase)
  const groups = service.stackIds
    .map((id) => stack.find((item) => item.id === id))
    .filter((item): item is (typeof stack)[number] => Boolean(item))

  return (
    <PageShell
      crumbs={[
        { label: site.name, to: '/' },
        { label: 'услуги', to: '/uslugi' },
        { label: service.name.toLowerCase() },
      ]}
    >
      <section className="chapter-fit page-hero">
        <div className="bay-head">
          <span className="tag tag-signal">{service.code}</span>
          <span className="tag">услуга</span>
        </div>
        <h1 className="plate plate-md mt-10 max-w-[18ch]">{service.h1}</h1>
        <p className="mt-6 max-w-[50ch] text-[length:var(--step-00)] leading-relaxed text-muted">{service.lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Magnetic as="a" href="#brief" label={site.ctaPrimary} className="link-plate link-plate-fill mono text-[length:var(--step-00)]">
            <span className="led led-signal relative z-[1]" />
            <span className="relative z-[1]">{site.ctaPrimary}</span>
          </Magnetic>
          {related ? (
            <Magnetic
              as={Link}
              to="/keysy/$slug"
              params={{ slug: related.slug }}
              label={related.name}
              className="link-plate mono text-[length:var(--step-00)]"
            >
              <span className="led relative z-[1]" />
              <span className="relative z-[1]">Смотреть кейс</span>
            </Magnetic>
          ) : null}
        </div>
      </section>

      <section className="chapter-fit">
        <div className="bay-head">
          <span className="tag tag-signal">01</span>
          <h2 className="tag">Что закрываем</h2>
        </div>
        <div className="mt-[clamp(2.5rem,6vw,4.5rem)] grid grid-cols-1 gap-px bg-[var(--hairline)] md:grid-cols-2">
          {service.points.map((item, i) => (
            <article key={item.title} className="panel p-8">
              <p className="tag tag-signal">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-8 text-[length:var(--step-2)] font-bold tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-4 text-[length:var(--step-00)] leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="chapter-fit">
        <div className="bay-head">
          <span className="tag tag-signal">02</span>
          <h2 className="tag">Как собираем</h2>
        </div>
        <div className="mt-[clamp(2.5rem,6vw,4.5rem)] grid grid-cols-1 gap-px bg-[var(--hairline)] md:grid-cols-3">
          {service.method.map((item, i) => (
            <article key={item.title} className="method-card panel p-8">
              <p className="tag tag-signal">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-8 text-[length:var(--step-2)] font-bold tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-4 text-[length:var(--step-00)] leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
        {groups.length ? (
          <div className="mt-10 grid grid-cols-1 gap-px bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <article key={group.id} className="panel panel-live p-7">
                <p className="tag tag-signal">{group.title}</p>
                <p className="mt-5 text-[length:var(--step-00)] leading-relaxed text-muted">{group.outcome}</p>
                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-3">
                  {group.tools.map((tool) => (
                    <li key={tool} className="flex items-center gap-2 text-[length:var(--step-000)]">
                      <span className="led" />
                      <span className="mono">{tool}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {related ? (
        <section className="chapter-fit">
          <div className="bay-head">
            <span className="tag tag-signal">03</span>
            <h2 className="tag">Связанный кейс</h2>
          </div>
          <article className="panel panel-live mt-10 overflow-hidden md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <img
              src={related.cover}
              alt={`${related.name}: ${related.teaser}`}
              className="case-thumb"
              width={1440}
              height={960}
            />
            <div className="p-8 md:p-10">
              <p className="tag tag-signal">{related.line}</p>
              <h3 className="mt-6 text-[length:var(--step-2)] font-bold tracking-[-0.03em]">{related.name}</h3>
              <p className="mt-4 text-[length:var(--step-00)] leading-relaxed text-muted">{related.teaser}</p>
              <p className="mono mt-6 text-signal text-[length:var(--step-3)] leading-none">{related.effect}</p>
              <Magnetic
                as={Link}
                to="/keysy/$slug"
                params={{ slug: related.slug }}
                label="Разбор кейса"
                className="link-plate mono mt-8 text-[length:var(--step-00)]"
              >
                <span className="led relative z-[1]" />
                <span className="relative z-[1]">Разбор кейса</span>
              </Magnetic>
            </div>
          </article>
        </section>
      ) : null}

      <section className="chapter-fit">
        <div className="bay-head">
          <span className="tag tag-signal">04</span>
          <h2 className="tag">Вопросы</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-px bg-[var(--hairline)]">
          {service.faq.map((item) => (
            <details key={item.q} className="stack-notes panel p-8">
              <summary className="cursor-pointer text-[length:var(--step-0)] font-semibold tracking-[-0.03em]">
                {item.q}
              </summary>
              <p className="mt-4 max-w-[62ch] text-[length:var(--step-00)] leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="chapter-fit">
        <div className="bay-head">
          <span className="tag tag-signal">05</span>
          <h2 className="tag">Другие направления</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-px bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-4">
          {services
            .filter((item) => item.slug !== service.slug)
            .map((item) => (
              <article key={item.slug} className="panel flex flex-col p-6">
                <span className="tag tag-signal">{item.code}</span>
                <h3 className="mt-4 text-[length:var(--step-0)] font-bold tracking-[-0.03em]">{item.name}</h3>
                <p className="mt-2 text-[length:var(--step-000)] leading-relaxed text-muted line-clamp-3">
                  {item.lead}
                </p>
                <div className="mt-auto pt-6">
                  <Magnetic
                    as={Link}
                    to="/uslugi/$slug"
                    params={{ slug: item.slug }}
                    label={`Услуга: ${item.name}`}
                    className="link-plate mono text-[length:var(--step-000)]"
                  >
                    <span className="led relative z-[1]" />
                    <span className="relative z-[1]">открыть</span>
                  </Magnetic>
                </div>
              </article>
            ))}
        </div>
      </section>

      <section className="chapter-fit" id="contact">
        <div className="bay-head">
          <span className="tag tag-signal">06</span>
          <span className="tag">подключение</span>
        </div>
        <h2 className="plate plate-md mt-10 max-w-[18ch]">{contactCopy.title}</h2>
        <p className="mt-5 max-w-[46ch] text-[length:var(--step-00)] leading-relaxed text-muted">{contactCopy.lead}</p>
        <div className="mt-10 max-w-3xl">
          <BriefForm defaultNeed={service.defaultNeed} />
        </div>
      </section>
    </PageShell>
  )
}
