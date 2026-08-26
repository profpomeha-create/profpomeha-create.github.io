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
      },
      pages: [
        {
          path: '/yandex_f3d45a2d7896cfdd.html',
          prerender: {
            enabled: true,
            outputPath: '/yandex_f3d45a2d7896cfdd.html',
          },
        },
      ],
    }),
    viteReact(),
    nitro(),
  ],
})
