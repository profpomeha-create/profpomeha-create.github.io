import { createFileRoute, notFound } from '@tanstack/react-router'
import { CasePage } from '~/components/pages/CasePage'
import { productBySlug } from '~/content/catalog'
import { site } from '~/content/site'
import { breadcrumbList, faqPage, organizationNode, pageHead, pageUrl } from '~/lib/seo'

export const Route = createFileRoute('/keysy/$slug')({
  head: ({ params }) => {
    const product = productBySlug(params.slug)
    if (!product) return { meta: [{ title: 'Страница не найдена' }] }
    const path = `/keysy/${product.slug}`
    return pageHead({
      title: product.seoTitle,
      description: product.seoDescription,
      path,
      jsonLd: [
        organizationNode(),
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: product.name,
          description: product.seoDescription,
          url: pageUrl(path),
          mainEntityOfPage: pageUrl(path),
          image: `${site.url}${site.seo.ogImage}`,
          author: { '@id': `${site.url}/#organization` },
          publisher: { '@id': `${site.url}/#organization` },
        },
        faqPage(product.faq),
        breadcrumbList([
          { name: site.name, path: '/' },
          { name: 'Кейсы', path: '/keysy' },
          { name: product.name, path },
        ]),
      ],
    })
  },
  component: CaseRoute,
})

function CaseRoute() {
  const { slug } = Route.useParams()
  const product = productBySlug(slug)
  if (!product) throw notFound()
  return <CasePage product={product} />
}
