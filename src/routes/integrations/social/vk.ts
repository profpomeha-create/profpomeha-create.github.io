import { createFileRoute } from '@tanstack/react-router'

const BODY = `<!DOCTYPE html>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<title>VK</title>
<script>
(function () {
  var params = new URLSearchParams(location.search);
  if (location.hash && location.hash.length > 1) {
    new URLSearchParams(location.hash.replace(/^#/, '')).forEach(function (value, key) {
      if (!params.has(key)) params.set(key, value);
    });
  }
  var raw = params.get('payload');
  if (raw) {
    try {
      var data = JSON.parse(raw);
      if (data.code) params.set('code', data.code);
      if (data.state) params.set('state', data.state);
      if (data.device_id) params.set('device_id', data.device_id);
      params.delete('payload');
    } catch (e) {}
  }
  location.replace('http://localhost:4007/integrations/social/vk?' + params.toString());
})();
</script>
`

export const Route = createFileRoute('/integrations/social/vk')({
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
