<script setup lang="ts">
useHead({
  titleTemplate: (title) => title
    ? `${title} · Flow Sports Nutrition`
    : 'Flow Sports Nutrition - Premium Athletic Supplements',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: '#0A1A2F' },
    { name: 'description', content: 'Premium athletic supplements for high-performance athletes. Fuel your flow with clean, science-backed nutrition.' },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
    { rel: 'preconnect', href: 'https://cdn.shopify.com' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})
</script>

<template>
  <AppHeader />
  <CartDrawer />
  <MobileMenu />
  <SearchMenu />
  <LocaleModal />

  <!-- Main -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <AppFooter />
</template>
