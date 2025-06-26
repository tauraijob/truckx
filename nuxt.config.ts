// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-toast',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode'
  ],
  nitro: {
    imports: {
      dirs: ['./server/utils']
    },
    externals: {
      inline: [],
      external: ['@prisma/client']
    },
    routeRules: {
      '/uploads/**': { ssr: true },
      // Ensure /uploads is always handled by the server
    },
    publicAssets: [
      { dir: 'public', maxAge: 60 * 60 * 24 * 7 },
      { dir: 'uploads', baseURL: '/uploads' }
    ]
  },
  experimental: {
    payloadExtraction: false
  },
  build: {
    transpile: ['bcryptjs', 'jsonwebtoken', '@headlessui/vue']
  },
  vite: {
    optimizeDeps: {
      exclude: ['@prisma/client'],
    },
    define: {
      'process.env.PRISMA_QUERY_ENGINE_LIBRARY': 'undefined',
      'process.env.PRISMA_MIGRATION_ENGINE_LIBRARY': 'undefined',
      'process.env.PRISMA_INTROSPECTION_ENGINE_LIBRARY': 'undefined',
      'process.env.PRISMA_FMT_BINARY_PATH': 'undefined',
      'process.env.PRISMA_QUERY_ENGINE_BINARY_PATH': 'undefined',
      'process.env.PRISMA_INTROSPECTION_ENGINE_BINARY_PATH': 'undefined'
    },
    ssr: {
      noExternal: ['tailwindcss']
    }
  },
  typescript: {
    strict: true
  },
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
  },
  compatibilityDate: '2025-04-03',
  app: {
    head: {
      title: 'TruckX - Trucking Marketplace',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern trucking marketplace connecting truck providers with load providers' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo.png' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3000',
      jwtSecret: process.env.JWT_SECRET || 'trtrtrtrdtrsersr54e54sxgfxfbfxfx'
    }
  },
  alias: {
    '#auth': resolve(__dirname, './server/utils/auth')
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Roboto', 'sans-serif'],
          },
          colors: {
            'navy': {
              50: '#f0f4f8',
              100: '#d9e2ec',
              200: '#bcccdc',
              300: '#9fb3c8',
              400: '#829ab1',
              500: '#627d98',
              600: '#486581',
              700: '#334e68',
              800: '#243b53',
              900: '#102a43',
            },
            'primary': {
              50: '#e6f1ff',
              100: '#cce3ff',
              200: '#99c7ff',
              300: '#66abff',
              400: '#338fff',
              500: '#0073ff',
              600: '#005ccc',
              700: '#004599',
              800: '#002e66',
              900: '#001733',
            }
          }
        }
      }
    }
  }
})
