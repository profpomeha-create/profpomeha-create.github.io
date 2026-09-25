import { createFileRoute } from '@tanstack/react-router'
import { catalogPaths } from '~/content/catalog'
import { sitemapXml } from '~/lib/seo'

const BODY = sitemapXml(catalogPaths(), new Date().toISOString().slice(0, 10))

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(BODY, {
          status: 200,
          headers: {
            'content-type': 'application/xml; charset=UTF-8',
            'cache-control': 'public, max-age=3600',
          },
        }),
    },
  },
})
