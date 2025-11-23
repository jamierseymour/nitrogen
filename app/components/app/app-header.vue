<script setup lang="ts">
// Stores
const appStore = useAppStore()

// Actions
const toggleMobileMenu = () => {
  appStore.toggle('mobileMenu')
}

const toggleCartDrawer = () => {
  appStore.toggle('cartDrawer')
}

const toggleLocaleModal = () => {
  appStore.toggle('localeModal')
}

const toggleSearchMenu = () => {
  appStore.toggle('searchMenu')
}
</script>

<template>
  <header class="fixed top-0 inset-x-0 z-100 bg-deep-navy/95 backdrop-blur-md border-b border-electric-blue/20">
    <NavDesktop
      @toggle-cart-drawer="toggleCartDrawer"
      @toggle-locale-modal="toggleLocaleModal"
      @toggle-search-menu="toggleSearchMenu"
    />
    <NavMobile
      @toggle-cart-drawer="toggleCartDrawer"
      @toggle-search-menu="toggleSearchMenu"
      @toggle-mobile-menu="toggleMobileMenu"
    />
  </header>
</template>
