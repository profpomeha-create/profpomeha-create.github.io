import { method } from '~/content/site'

export function Method() {
  return (
    <section id="method" className="chapter flex flex-col justify-center" aria-labelledby="method-title">
      <div className="bay-head">
        <span className="tag tag-signal">03</span>
        <h2 id="method-title" className="tag">
          инженерный подход
        </h2>
      </div>

      <p className="mt-10 max-w-[40ch] text-[length:var(--step-2)] font-semibold tracking-[-0.03em]">
        Три правила, без которых инфраструктура не считается живой.
      </p>

      <div className="mt-[clamp(2.5rem,6vw,4.5rem)] grid grid-cols-1 gap-px bg-[var(--hairline)] md:grid-cols-3">
        {method.map((item, i) => (
          <article key={item.id} className="method-card panel p-8">
            <p className="tag tag-signal">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-8 text-[length:var(--step-2)] font-bold tracking-[-0.03em]">{item.title}</h3>
            <p className="mt-4 text-[length:var(--step-00)] leading-relaxed text-muted">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
