import type { ReactNode } from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import appCss from '~/styles.css?url'
import { NotFoundPage } from '~/components/PageShell'
import { site } from '~/content/site'
import {
  YandexMetrikaScript,
  YandexMetrikaNoscript,
  YandexMetrikaTracker,
} from '~/components/YandexMetrika'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: site.seo.title },
      { name: 'description', content: site.seo.description },
      { name: 'robots', content: 'index, follow' },
      { name: 'theme-color', content: '#121316' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg', sizes: 'any' },
      { rel: 'icon', type: 'image/png', sizes: '120x120', href: '/favicon-120x120.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192x192.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '120x120', href: '/favicon.png' },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48 32x32 16x16' },
    ],
  }),
  notFoundComponent: NotFoundPage,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <YandexMetrikaTracker />
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
        <YandexMetrikaScript />
      </head>
      <body>
        <YandexMetrikaNoscript />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
