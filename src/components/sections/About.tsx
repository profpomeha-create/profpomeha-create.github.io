import { BrandMark } from '~/components/Brand'
import { about } from '~/content/site'

export function About() {
  return (
    <section id="about" className="chapter flex flex-col justify-center" aria-labelledby="about-title">
      <div className="bay-head">
        <span className="tag tag-signal">01</span>
        <h2 id="about-title" className="tag">
          {about.title}
        </h2>
      </div>

      <div className="mt-[clamp(2.5rem,6vw,4.5rem)] grid grid-cols-1 gap-px bg-[var(--hairline)] lg:grid-cols-[1.4fr_1fr]">
        <article className="about-card panel p-8 md:p-10">
          <p className="max-w-[46ch] text-[length:var(--step-2)] font-semibold tracking-[-0.03em]">{about.lead}</p>
        </article>
        <article className="about-card panel panel-live p-8 md:p-10">
          <div className="flex items-start justify-between gap-6">
            <p className="tag tag-signal">команда</p>
            <span aria-hidden="true">
              <BrandMark className="h-10 w-auto opacity-80" />
            </span>
          </div>
          <h3 className="mt-8 text-[length:var(--step-2)] font-bold tracking-[-0.03em]">{about.team}</h3>
          <p className="mt-2 tag">{about.teamRole}</p>
          <p className="mt-5 max-w-[36ch] text-[length:var(--step-00)] leading-relaxed text-muted">
            {about.teamLine}
          </p>
        </article>
      </div>
    </section>
  )
}
