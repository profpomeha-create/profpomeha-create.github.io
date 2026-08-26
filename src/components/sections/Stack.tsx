import { stack, stackNotes } from '~/content/site'

export function Stack() {
  return (
    <section id="stack" className="chapter flex flex-col justify-center" aria-labelledby="stack-title">
      <div className="bay-head">
        <span className="tag tag-signal">05</span>
        <h2 id="stack-title" className="tag">
          Технологии и платформа
        </h2>
      </div>

      <p className="mt-10 max-w-[44ch] text-[length:var(--step-2)] font-semibold tracking-[-0.03em]">
        Из чего строим рабочий контур — и что это даёт на живых сервисах.
      </p>

      <div className="stack-bus mt-[clamp(3rem,7vw,5.5rem)]" aria-hidden="true" />

      <div className="mt-10 grid grid-cols-1 gap-px bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((group) => (
          <article key={group.id} className="stack-module panel panel-live p-7">
            <span className="stack-drop" aria-hidden="true" />
            <div className="flex items-baseline justify-between gap-4">
              <p className="tag tag-signal">{group.title}</p>
              <span className="mono text-[10px] text-faint tabular-nums">
                {String(group.tools.length).padStart(2, '0')}
              </span>
            </div>
            <p className="mt-5 text-[length:var(--step-00)] leading-relaxed text-muted">{group.outcome}</p>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-3">
              {group.tools.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[length:var(--step-000)]">
                  <span className="led stack-led" />
                  <span className="mono">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <details className="stack-notes mt-8">
        <summary className="tag cursor-pointer text-faint">{stackNotes.title}</summary>
        <p className="mt-4 max-w-[62ch] text-[length:var(--step-00)] leading-relaxed text-muted">{stackNotes.body}</p>
      </details>
    </section>
  )
}
