import { createFileRoute } from '@tanstack/react-router'

const BODY = `google-site-verification: googled4275817b7b8a702.html\n`

export const Route = createFileRoute('/googled4275817b7b8a702.html')({
  server: {
    handlers: {
      GET: () =>
        new Response(BODY, {
          status: 200,
          headers: {
            'content-type': 'text/html; charset=UTF-8',
            'cache-control': 'no-store',
            'x-robots-tag': 'noindex',
          },
        }),
    },
  },
})
