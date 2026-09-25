import { createFileRoute } from '@tanstack/react-router'
import { Experience } from '~/components/Experience'
import { site } from '~/content/site'
import { homeJsonLd, pageHead } from '~/lib/seo'

export const Route = createFileRoute('/')({
  head: () =>
    pageHead({
      title: site.seo.title,
      description: site.seo.description,
      path: '/',
      jsonLd: homeJsonLd(),
    }),
  component: Home,
})

function Home() {
  return <Experience />
}
