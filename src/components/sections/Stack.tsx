import { stack } from '~/content/site'

export function Stack() {
  return (
    <section id="stack" className="chapter flex flex-col justify-center" aria-labelledby="stack-title">
      <div className="bay-head">
        <span className="tag tag-signal">04</span>
        <h2 id="stack-title" className="tag">
          щит управления
        </h2>
      </div>

      {/* Power bus feeding four modules — drawn on scroll, then the ports light up */}
      <div className="stack-bus mt-[clamp(3rem,7vw,5.5rem)]" aria-hidden="true" />

      <div className="mt-10 grid grid-cols-1 gap-px bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((group) => (
          <article key={group.id} className="stack-module panel panel-live p-7">
            <span className="stack-drop" aria-hidden="true" />
            <div className="flex items-baseline justify-between gap-4">
              <p className="tag tag-signal">{group.title}</p>
              <span className="mono text-[10px] text-faint tabular-nums">
                {String(group.items.length).padStart(2, '0')}
              </span>
            </div>
            <ul className="mt-7 space-y-4">
              {group.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[length:var(--step-00)]">
                  <span className="led stack-led" />
                  <span className="mono">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
