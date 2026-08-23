import { products } from '~/content/site'

export function Products() {
  const total = String(products.length).padStart(2, '0')

  return (
    <section id="cases" className="cases-section" aria-labelledby="cases-title">
      <h2 id="cases-title" className="sr-only">
        Кейсы
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
              alt=""
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
                <span className="tag tag-signal">02</span>
                <span className="tag">
                  кейс {item.code} / {total} · {item.line}
                </span>
              </div>

              <h3 className="plate plate-lg mt-10 max-w-[16ch]">{item.name}</h3>
              <p className="mt-6 max-w-2xl text-[length:var(--step-00)] leading-relaxed text-muted">{item.pitch}</p>

              <dl className="mt-10 max-w-3xl">
                <div className="flex flex-col gap-1 border-t border-[var(--hairline)] py-4 sm:flex-row sm:gap-10">
                  <dt className="tag w-28 flex-none pt-1">контур</dt>
                  <dd className="text-[length:var(--step-00)] text-muted">{item.problem}</dd>
                </div>
                <div className="flex flex-col gap-1 border-t border-[var(--hairline)] py-4 sm:flex-row sm:gap-10">
                  <dt className="tag w-28 flex-none pt-1">сборка</dt>
                  <dd className="text-[length:var(--step-00)] text-muted">{item.solution}</dd>
                </div>
                <div className="flex items-baseline gap-10 border-t border-[var(--hairline)] pt-5">
                  <dt className="tag w-28 flex-none">эффект</dt>
                  <dd className="mono text-signal text-[length:var(--step-3)] leading-none">{item.effect}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
