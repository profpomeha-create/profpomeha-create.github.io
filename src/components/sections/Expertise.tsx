import { Link } from '@tanstack/react-router'
import { Magnetic } from '~/components/Magnetic'
import { expertiseToService } from '~/content/catalog'
import { expertise } from '~/content/site'

export function Expertise() {
  return (
    <section id="expertise" className="chapter flex flex-col justify-center" aria-labelledby="expertise-title">
      <div className="bay-head">
        <span className="tag tag-signal">02</span>
        <h2 id="expertise-title" className="tag">
          Что берём в работу
        </h2>
      </div>

      <p className="mt-10 max-w-[40ch] text-[length:var(--step-2)] font-semibold tracking-[-0.03em]">
        Один подрядчик от кода до запуска: сервис, сеть, защита, ИИ и сопровождение.
      </p>

      <div className="mt-[clamp(2.5rem,6vw,4.5rem)] grid grid-cols-1 gap-px bg-[var(--hairline)] md:grid-cols-2 lg:grid-cols-3">
        {expertise.map((item, i) => (
          <article
            key={item.id}
            className="expertise-card method-card panel flex h-full flex-col p-8"
          >
            <p className="tag tag-signal">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-8 text-[length:var(--step-2)] font-bold tracking-[-0.03em]">{item.title}</h3>
            <p className="mt-4 text-[length:var(--step-00)] leading-relaxed text-muted">{item.body}</p>
            <div className="mt-auto pt-8">
              <Magnetic
                as={Link}
                to="/uslugi/$slug"
                params={{ slug: expertiseToService[item.id] ?? 'infrastruktura' }}
                label="Открыть направление"
                className="link-plate mono text-[length:var(--step-000)]"
              >
                <span className="led relative z-[1]" />
                <span className="relative z-[1]">открыть направление</span>
              </Magnetic>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
