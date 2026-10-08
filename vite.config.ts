import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
    host: '127.0.0.1',
    watch: {
      ignored: ['**/AAA LAB_LOGO.png'],
    },
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
      prerender: {
        enabled: true,
        crawlLinks: true,
        filter: ({ path }) => path !== '/$' && !path.startsWith('/$'),
      },
      pages: [
        { path: '/' },
        {
          path: '/yandex_f3d45a2d7896cfdd.html',
          prerender: {
            enabled: true,
            outputPath: '/yandex_f3d45a2d7896cfdd.html',
          },
        },
        {
          path: '/googled4275817b7b8a702.html',
          prerender: {
            enabled: true,
            outputPath: '/googled4275817b7b8a702.html',
          },
        },
        {
          path: '/sitemap.xml',
          prerender: {
            enabled: true,
            outputPath: '/sitemap.xml',
          },
        },
        {
          path: '/404',
          prerender: {
            enabled: true,
            outputPath: '/404.html',
          },
        },
        {
          path: '/integrations/social/vk',
          prerender: {
            enabled: true,
            outputPath: '/integrations/social/vk/index.html',
          },
        },
        { path: '/privacy' },

        { path: '/uslugi' },
        { path: '/uslugi/infrastruktura' },
        { path: '/uslugi/set' },
        { path: '/uslugi/backend' },
        { path: '/uslugi/pochta' },
        { path: '/uslugi/ai' },
        { path: '/keysy' },
        { path: '/keysy/set' },
        { path: '/keysy/uchet' },
        { path: '/keysy/pochta' },
        { path: '/keysy/server' },
        { path: '/keysy/ai' },
      ],
    }),
    viteReact(),
    nitro(),
  ],
})
