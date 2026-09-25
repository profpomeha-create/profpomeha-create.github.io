import { Link } from '@tanstack/react-router'
import { BriefForm } from '~/components/BriefForm'
import { Magnetic } from '~/components/Magnetic'
import { PageShell } from '~/components/PageShell'
import { contactCopy, products, site, type Product } from '~/content/site'
import { serviceByRelated } from '~/content/catalog'

export function CasePage({ product }: { product: Product }) {
  const related = serviceByRelated(product.relatedService)

  return (
    <PageShell
      crumbs={[
        { label: site.name, to: '/' },
        { label: 'кейсы', to: '/keysy' },
        { label: product.name.toLowerCase() },
      ]}
    >
      <article className="case-panel">
        <img
          src={product.cover}
          alt={`${product.name}: ${product.teaser}`}
          className="case-cover"
          width={1440}
          height={960}
        />
        <div className="case-veil" />
        <div className="case-copy">
          <div className="bay-head max-w-3xl">
            <span className="tag tag-signal">{product.code}</span>
            <span className="tag">кейс · {product.line}</span>
          </div>
          <h1 className="plate plate-md mt-8 max-w-[16ch]">{product.name}</h1>
          <dl className="mt-8 max-w-3xl">
            <div className="flex flex-col gap-1 border-t border-[var(--hairline)] py-3 sm:flex-row sm:gap-10">
              <dt className="tag w-28 flex-none pt-1">контекст</dt>
              <dd className="text-[length:var(--step-00)] text-muted">{product.context}</dd>
            </div>
            <div className="flex flex-col gap-1 border-t border-[var(--hairline)] py-3 sm:flex-row sm:gap-10">
              <dt className="tag w-28 flex-none pt-1">риск</dt>
              <dd className="text-[length:var(--step-00)] text-muted">{product.risk}</dd>
            </div>
            <div className="flex flex-col gap-1 border-t border-[var(--hairline)] py-3 sm:flex-row sm:gap-10">
              <dt className="tag w-28 flex-none pt-1">сделали</dt>
              <dd className="text-[length:var(--step-00)] text-muted">{product.solution}</dd>
            </div>
            <div className="flex flex-col gap-1 border-t border-[var(--hairline)] py-3 sm:flex-row sm:gap-10">
              <dt className="tag w-28 flex-none pt-1">контур</dt>
              <dd className="text-[length:var(--step-00)] text-muted">{product.contour}</dd>
            </div>
            <div className="flex items-baseline gap-10 border-t border-[var(--hairline)] pt-5">
              <dt className="tag w-28 flex-none">эффект</dt>
              <dd className="mono text-signal text-[length:var(--step-3)] leading-none">{product.effect}</dd>
            </div>
          </dl>
        </div>
      </article>

      <section className="chapter-fit">
        <div className="bay-head">
          <span className="tag tag-signal">01</span>
          <h2 className="tag">Что это даёт заказчику</h2>
        </div>
        <p className="mt-10 max-w-[54ch] text-[length:var(--step-00)] leading-relaxed text-muted">{product.detail}</p>
        {related ? (
          <Magnetic
            as={Link}
            to="/uslugi/$slug"
            params={{ slug: related.slug }}
            label={related.name}
            className="link-plate mono mt-8 text-[length:var(--step-00)]"
          >
            <span className="led relative z-[1]" />
            <span className="relative z-[1]">{related.name}</span>
          </Magnetic>
        ) : null}
      </section>

      <section className="chapter-fit">
        <div className="bay-head">
          <span className="tag tag-signal">02</span>
          <h2 className="tag">Вопросы</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-px bg-[var(--hairline)]">
          {product.faq.map((item) => (
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
          <span className="tag tag-signal">03</span>
          <h2 className="tag">Другие кейсы</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-px bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-4">
          {products
            .filter((item) => item.slug !== product.slug)
            .map((item) => (
              <article key={item.slug} className="panel flex flex-col p-6">
                <span className="tag tag-signal">{item.code} · {item.line}</span>
                <h3 className="mt-4 text-[length:var(--step-0)] font-bold tracking-[-0.03em]">{item.name}</h3>
                <p className="mt-2 text-[length:var(--step-000)] leading-relaxed text-muted line-clamp-3">
                  {item.teaser}
                </p>
                <p className="mono mt-4 text-signal text-[length:var(--step-000)]">{item.effect}</p>
                <div className="mt-auto pt-6">
                  <Magnetic
                    as={Link}
                    to="/keysy/$slug"
                    params={{ slug: item.slug }}
                    label={`Кейс: ${item.name}`}
                    className="link-plate mono text-[length:var(--step-000)]"
                  >
                    <span className="led relative z-[1]" />
                    <span className="relative z-[1]">разбор</span>
                  </Magnetic>
                </div>
              </article>
            ))}
        </div>
      </section>

      <section className="chapter-fit" id="contact">
        <div className="bay-head">
          <span className="tag tag-signal">04</span>
          <span className="tag">подключение</span>
        </div>
        <h2 className="plate plate-md mt-10 max-w-[18ch]">{contactCopy.title}</h2>
        <p className="mt-5 max-w-[46ch] text-[length:var(--step-00)] leading-relaxed text-muted">{contactCopy.lead}</p>
        <div className="mt-10 max-w-3xl">
          <BriefForm defaultNeed={related?.defaultNeed ?? ''} />
        </div>
      </section>
    </PageShell>
  )
}
