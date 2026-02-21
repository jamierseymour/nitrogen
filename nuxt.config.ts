import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-11-23",

  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/eslint",
    "@nuxt/image",
    // "@nuxthub/core", // Disabled for Vercel deployment - only compatible with Cloudflare
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

  runtimeConfig: {
    supabaseUrl: process.env.NUXT_SUPABASE_URL,
    supabaseKey: process.env.NUXT_SUPABASE_ANON_KEY,
    public: {
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  },

  site: {
    url: "https://flowsportsnutrition.com",
    name: "Flow Sports Nutrition",
  },

  sitemap: {
    sources: ["/api/sitemap"],
  },

  robots: {
    disallow: ["/account", "/account/*"],
    sitemap: "https://flowsportsnutrition.com/sitemap.xml",
  },

  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },

  // Disabled @nuxt/fonts module - using custom fonts in app/assets/styles/fonts.css
  // fonts: {
  //   providers: {
  //     none: true,
  //   },
  // },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  css: ["@/assets/styles/app.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  components: [
    {
      path: "@/components",
      pathPrefix: false,
    },
  ],

  nitro: {
    preset: 'vercel',
  },
});
