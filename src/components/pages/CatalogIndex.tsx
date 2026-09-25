import { Link } from '@tanstack/react-router'
import { BriefForm } from '~/components/BriefForm'
import { Magnetic } from '~/components/Magnetic'
import { PageShell } from '~/components/PageShell'
import { contactCopy, site } from '~/content/site'

export type CatalogCard = {
  code: string
  name: string
  teaser: string
  to: '/uslugi/$slug' | '/keysy/$slug'
  slug: string
  effect?: string
}

export function CatalogIndex({
  crumbs,
  code,
  kicker,
  h1,
  lead,
  cards,
}: {
  crumbs: { label: string; to?: string }[]
  code: string
  kicker: string
  h1: string
  lead: string
  cards: CatalogCard[]
}) {
  return (
    <PageShell crumbs={crumbs}>
      <section className="chapter-fit page-hero">
        <div className="bay-head">
          <span className="tag tag-signal">{code}</span>
          <span className="tag">{kicker}</span>
        </div>
        <h1 className="plate plate-md mt-10 max-w-[16ch]">{h1}</h1>
        <p className="mt-6 max-w-[46ch] text-[length:var(--step-2)] font-semibold tracking-[-0.03em]">{lead}</p>
        <div className="mt-[clamp(2.5rem,6vw,4.5rem)] grid grid-cols-1 gap-px bg-[var(--hairline)] md:grid-cols-2 lg:grid-cols-3">
          {cards.map((item) => (
            <article key={item.to} className="panel panel-live p-8">
              <p className="tag tag-signal">{item.code}</p>
              <h2 className="mt-8 text-[length:var(--step-2)] font-bold tracking-[-0.03em]">{item.name}</h2>
              <p className="mt-4 text-[length:var(--step-00)] leading-relaxed text-muted">{item.teaser}</p>
              {item.effect ? (
                <p className="mono mt-5 text-signal text-[length:var(--step-1)]">{item.effect}</p>
              ) : null}
              <Magnetic
                as={Link}
                to={item.to}
                params={{ slug: item.slug }}
                label={item.name}
                className="link-plate mono mt-8 text-[length:var(--step-00)]"
              >
                <span className="led relative z-[1]" />
                <span className="relative z-[1]">Открыть</span>
              </Magnetic>
            </article>
          ))}
        </div>
      </section>
      <section className="chapter-fit" id="contact">
        <div className="bay-head">
          <span className="tag tag-signal">00</span>
          <span className="tag">подключение</span>
        </div>
        <h2 className="plate plate-md mt-10 max-w-[18ch]">{contactCopy.title}</h2>
        <p className="mt-5 max-w-[46ch] text-[length:var(--step-00)] leading-relaxed text-muted">{contactCopy.lead}</p>
        <div className="mt-10 max-w-3xl">
          <BriefForm />
        </div>
      </section>
    </PageShell>
  )
}

export const studioCrumb = { label: site.name, to: '/' }
