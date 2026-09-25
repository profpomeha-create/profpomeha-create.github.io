import { createFileRoute } from '@tanstack/react-router'
import { CatalogIndex, studioCrumb } from '~/components/pages/CatalogIndex'
import { services, uslugiIndex } from '~/content/services'
import { breadcrumbList, itemList, organizationNode, pageHead } from '~/lib/seo'
import { site } from '~/content/site'

export const Route = createFileRoute('/uslugi/')({
  head: () =>
    pageHead({
      title: uslugiIndex.title,
      description: uslugiIndex.description,
      path: '/uslugi',
      jsonLd: [
        organizationNode(),
        breadcrumbList([
          { name: site.name, path: '/' },
          { name: 'Услуги', path: '/uslugi' },
        ]),
        itemList(
          'Услуги AAA lab',
          services.map((item) => ({ name: item.name, path: `/uslugi/${item.slug}` })),
        ),
      ],
    }),
  component: UslugiIndex,
})

function UslugiIndex() {
  return (
    <CatalogIndex
      crumbs={[studioCrumb, { label: 'услуги' }]}
      code="02"
      kicker="направления"
      h1={uslugiIndex.h1}
      lead={uslugiIndex.lead}
      cards={services.map((item) => ({
        code: item.code,
        name: item.name,
        teaser: item.lead,
        to: '/uslugi/$slug',
        slug: item.slug,
      }))}
    />
  )
}
