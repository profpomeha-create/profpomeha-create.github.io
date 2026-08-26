import { createFileRoute } from '@tanstack/react-router'

const BODY = `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>Verification: f3d45a2d7896cfdd</body>
</html>`

export const Route = createFileRoute('/yandex_f3d45a2d7896cfdd.html')({
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
