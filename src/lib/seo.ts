import { services } from '~/content/services'
import { site } from '~/content/site'

export function pageUrl(path: string) {
  if (!path || path === '/') return `${site.url}/`
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}

const ogImage = () => `${site.url}${site.seo.ogImage}`

export function organizationNode() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.name,
    email: site.email,
    url: `${site.url}/`,
    image: ogImage(),
    logo: `${site.url}/logo.png`,
    sameAs: [site.github, site.telegram, site.getsaldo].filter(Boolean),
    description: site.seo.description,
  }
}

export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: pageUrl(item.path),
    })),
  }
}

export function faqPage(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function itemList(name: string, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: pageUrl(item.path),
    })),
  }
}

export function pageHead({
  title,
  description,
  path,
  jsonLd,
}: {
  title: string
  description: string
  path: string
  jsonLd?: unknown
}) {
  const url = pageUrl(path)
  const image = ogImage()
  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    headline: title,
    description,
    url,
    inLanguage: 'ru-RU',
    isPartOf: {
      '@type': 'WebSite',
      name: site.name,
      url: `${site.url}/`,
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: `${site.url}/`,
    },
  }

  const rawList: unknown[] = []
  if (Array.isArray(jsonLd)) {
    rawList.push(...jsonLd)
  } else if (jsonLd && typeof jsonLd === 'object') {
    if (
      '@graph' in (jsonLd as Record<string, unknown>) &&
      Array.isArray((jsonLd as { '@graph': unknown[] })['@graph'])
    ) {
      rawList.push(...(jsonLd as { '@graph': unknown[] })['@graph'])
    } else {
      rawList.push(jsonLd)
    }
  }

  const hasWebPage = rawList.some((item) => isWebPage(item))
  const allEntities = hasWebPage ? rawList : [webPage, ...rawList]

  const normalizedEntities = allEntities
    .filter((item): item is Record<string, unknown> =>
      Boolean(item && typeof item === 'object'),
    )
    .map((entity) => ({
      '@context': 'https://schema.org',
      ...entity,
    }))

  return {
    title,
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: 'ru_RU' },
      { property: 'og:site_name', content: site.name },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: `${site.name}. ${site.role}` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:image:alt', content: `${site.name}. ${site.role}` },
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: normalizedEntities.map((entity) => ({
      type: 'application/ld+json',
      children: JSON.stringify(entity),
    })),
  }
}

function isWebPage(value: unknown): value is { '@type': string } {
  return Boolean(
    value &&
      typeof value === 'object' &&
      '@type' in value &&
      (value as { '@type': unknown })['@type'] === 'WebPage',
  )
}

export function homeJsonLd() {
  const url = pageUrl('/')
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: site.seo.title,
    headline: site.h1,
    alternativeHeadline: site.subtitle,
    description: site.seo.description,
    inLanguage: 'ru-RU',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url,
      name: site.name,
      publisher: { '@id': `${site.url}/#organization` },
    },
    about: organizationNode(),
    publisher: { '@id': `${site.url}/#organization` },
    mainEntity: {
      '@type': 'ProfessionalService',
      '@id': `${site.url}/#service`,
      name: site.name,
      url,
      email: site.email,
      image: ogImage(),
      description: site.seo.description,
      areaServed: site.location,
      provider: { '@id': `${site.url}/#organization` },
    },
    hasPart: itemList(
      'Услуги AAA lab',
      services.map((item) => ({ name: item.name, path: `/uslugi/${item.slug}` })),
    ),
  }
}

export function sitemapXml(paths: string[], lastmod: string) {
  const body = paths
    .map((path) => {
      const depth = path === '/' ? 1 : path.split('/').filter(Boolean).length
      const priority = path === '/' ? '1.0' : depth === 1 ? '0.8' : '0.7'
      const changefreq = path === '/' ? 'weekly' : 'monthly'
      return `  <url>
    <loc>${pageUrl(path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}
