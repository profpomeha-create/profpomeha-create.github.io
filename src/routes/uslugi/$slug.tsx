import { createFileRoute, notFound } from '@tanstack/react-router'
import { ServicePage } from '~/components/pages/ServicePage'
import { serviceBySlug } from '~/content/services'
import { site } from '~/content/site'
import { breadcrumbList, faqPage, organizationNode, pageHead, pageUrl } from '~/lib/seo'

export const Route = createFileRoute('/uslugi/$slug')({
  head: ({ params }) => {
    const service = serviceBySlug(params.slug)
    if (!service) return { meta: [{ title: 'Страница не найдена' }] }
    const path = `/uslugi/${service.slug}`
    return pageHead({
      title: service.title,
      description: service.description,
      path,
      jsonLd: [
        organizationNode(),
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.h1,
          description: service.description,
          url: pageUrl(path),
          provider: { '@id': `${site.url}/#organization` },
          areaServed: site.location,
        },
        faqPage(service.faq),
        breadcrumbList([
          { name: site.name, path: '/' },
          { name: 'Услуги', path: '/uslugi' },
          { name: service.name, path },
        ]),
      ],
    })
  },
  component: ServiceRoute,
})

function ServiceRoute() {
  const { slug } = Route.useParams()
  const service = serviceBySlug(slug)
  if (!service) throw notFound()
  return <ServicePage service={service} />
}
