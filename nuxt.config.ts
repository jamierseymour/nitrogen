import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxthub/core',
  ],

  shopify: {
    domain: process.env.NUXT_SHOPIFY_DOMAIN,
    apiVersion: process.env.NUXT_SHOPIFY_API_VERSION,
    adminAccessToken: process.env.NUXT_SHOPIFY_ADMIN_ACCESS_TOKEN,
    storefrontAccessToken: process.env.NUXT_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  },

  klaviyo: {
    apiVersion: process.env.NUXT_KLAVIYO_API_VERSION,
    publicApiKey: process.env.NUXT_KLAVIYO_PUBLIC_API_KEY,
    privateApiKey: process.env.NUXT_KLAVIYO_PRIVATE_API_KEY,
  },

  site: {
    url: 'https://flowsportsnutrition.com',
    name: 'Flow Sports Nutrition',
  },

  sitemap: {
    sources: [
      '/api/sitemap',
    ],
  },

  robots: {
    disallow: ['/account', '/account/*'],
    sitemap: 'https://flowsportsnutrition.com/sitemap.xml',
  },

  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },

  fonts: {
    families: [
      { name: 'Montserrat', weights: [400, 500, 600, 700, 800] },
      { name: 'Inter', weights: [400, 500, 600] },
      { name: 'Teko', weights: [400, 500, 600, 700] },
    ],
    defaults: {
      weights: [400, 500, 600, 700, 800],
      styles: ['normal'],
      subsets: ['latin'],
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  css: ['@/assets/styles/app.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  components: [
    {
      path: '@/components',
      pathPrefix: false,
    },
  ],
})
