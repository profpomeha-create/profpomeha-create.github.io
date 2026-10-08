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
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'apple-touch-icon', href: '/favicon.png' },
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
