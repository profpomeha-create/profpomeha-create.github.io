import { createFileRoute } from '@tanstack/react-router'
import { CatalogIndex, studioCrumb } from '~/components/pages/CatalogIndex'
import { keysyIndex } from '~/content/services'
import { products, site } from '~/content/site'
import { breadcrumbList, itemList, organizationNode, pageHead } from '~/lib/seo'

export const Route = createFileRoute('/keysy/')({
  head: () =>
    pageHead({
      title: keysyIndex.title,
      description: keysyIndex.description,
      path: '/keysy',
      jsonLd: [
        organizationNode(),
        breadcrumbList([
          { name: site.name, path: '/' },
          { name: 'Кейсы', path: '/keysy' },
        ]),
        itemList(
          'Кейсы AAA lab',
          products.map((item) => ({ name: item.name, path: `/keysy/${item.slug}` })),
        ),
      ],
    }),
  component: KeysyIndex,
})

function KeysyIndex() {
  return (
    <CatalogIndex
      crumbs={[studioCrumb, { label: 'кейсы' }]}
      code="03"
      kicker="разборы"
      h1={keysyIndex.h1}
      lead={keysyIndex.lead}
      cards={products.map((item) => ({
        code: item.code,
        name: item.name,
        teaser: item.teaser,
        to: '/keysy/$slug',
        slug: item.slug,
        effect: item.effect,
      }))}
    />
  )
}
