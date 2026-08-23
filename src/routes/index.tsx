import { createFileRoute } from '@tanstack/react-router'
import { Experience } from '~/components/Experience'
import { site } from '~/content/site'

const ogImage = `${site.url}${site.seo.ogImage}`

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: site.seo.title },
      { name: 'description', content: site.seo.description },
      { property: 'og:title', content: site.seo.title },
      { property: 'og:description', content: site.seo.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: site.url },
      { property: 'og:locale', content: 'ru_RU' },
      { property: 'og:site_name', content: site.name },
      { property: 'og:image', content: ogImage },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: `${site.name} — ${site.role}` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: site.seo.title },
      { name: 'twitter:description', content: site.seo.description },
      { name: 'twitter:image', content: ogImage },
      { name: 'twitter:image:alt', content: `${site.name} — ${site.role}` },
    ],
    links: [{ rel: 'canonical', href: site.url }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: site.name,
          jobTitle: site.role,
          email: site.email,
          url: site.url,
          image: ogImage,
          sameAs: [site.telegram, site.github],
          description: site.seo.description,
        }),
      },
    ],
  }),
  component: Home,
})

function Home() {
  return <Experience />
}
