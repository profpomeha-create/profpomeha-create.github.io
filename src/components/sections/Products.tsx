import { Link } from '@tanstack/react-router'
import { Magnetic } from '~/components/Magnetic'
import { products } from '~/content/site'

export function Products() {
  const total = String(products.length).padStart(2, '0')

  return (
    <section id="cases" className="cases-section" aria-labelledby="cases-title">
      <h2 id="cases-title" className="sr-only">
        Кейсы: сеть, учёт, почта, серверы, ИИ
      </h2>
      <div className="cases-pin">
        {products.map((item, i) => (
          <article
            key={item.id}
            id={`case-${item.id}`}
            className="case-panel"
            data-case-index={i}
          >
            <img
              src={item.cover}
              alt={`${item.name}: ${item.teaser}`}
              className="case-cover"
              width={1440}
              height={960}
              decoding="async"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
            <div className="case-veil" />
            <div className="case-copy">
              <div className="bay-head max-w-3xl">
                <span className="tag tag-signal">03</span>
                <span className="tag">
                  кейс {item.code} / {total} · {item.line}
                </span>
              </div>

              <h3 className="plate plate-md mt-8 max-w-[16ch]">{item.name}</h3>

              <dl className="mt-8 max-w-3xl">
                <div className="flex flex-col gap-1 border-t border-[var(--hairline)] py-3 sm:flex-row sm:gap-10">
                  <dt className="tag w-28 flex-none pt-1">контекст</dt>
                  <dd className="text-[length:var(--step-00)] text-muted">{item.context}</dd>
                </div>
                <div className="flex flex-col gap-1 border-t border-[var(--hairline)] py-3 sm:flex-row sm:gap-10">
                  <dt className="tag w-28 flex-none pt-1">риск</dt>
                  <dd className="text-[length:var(--step-00)] text-muted">{item.risk}</dd>
                </div>
                <div className="flex flex-col gap-1 border-t border-[var(--hairline)] py-3 sm:flex-row sm:gap-10">
                  <dt className="tag w-28 flex-none pt-1">сделали</dt>
                  <dd className="text-[length:var(--step-00)] text-muted">{item.solution}</dd>
                </div>
                <div className="flex flex-col gap-1 border-t border-[var(--hairline)] py-3 sm:flex-row sm:gap-10">
                  <dt className="tag w-28 flex-none pt-1">контур</dt>
                  <dd className="text-[length:var(--step-00)] text-muted">{item.contour}</dd>
                </div>
                <div className="flex items-baseline gap-10 border-t border-[var(--hairline)] pt-5">
                  <dt className="tag w-28 flex-none">эффект</dt>
                  <dd className="mono text-signal text-[length:var(--step-3)] leading-none">{item.effect}</dd>
                </div>
              </dl>
              <Magnetic
                as={Link}
                to="/keysy/$slug"
                params={{ slug: item.slug }}
                label="Разбор кейса"
                className="link-plate mono mt-8 text-[length:var(--step-00)]"
              >
                <span className="led relative z-[1]" />
                <span className="relative z-[1]">Разбор кейса</span>
              </Magnetic>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
