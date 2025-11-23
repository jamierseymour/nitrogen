<script setup lang="ts">
// Links
const footerLinks1 = [
  { label: 'About Flow Sports', path: '/about' },
  { label: 'Our Athletes', path: '/athletes' },
  { label: 'Science & Research', path: '/science' },
  { label: 'Contact Us', path: '/contact' },
]

const footerLinks2 = [
  { label: 'FAQ', path: '/faq' },
  { label: 'Shipping & Returns', path: '/shipping' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
]

const footerLinks3 = [
  { label: 'Instagram', path: 'https://instagram.com' },
  { label: 'TikTok', path: 'https://tiktok.com' },
  { label: 'YouTube', path: 'https://youtube.com' },
  { label: 'Twitter/X', path: 'https://twitter.com' },
]
</script>

<template>
  <footer class="relative bg-charcoal border-t border-electric-blue/20">
    <nav class="hidden flex-col p-12 gap-16 lg:flex">
      <div class="grid grid-cols-4 gap-12">
        <div class="flex flex-col max-w-fit space-y-3">
          <h3 class="uppercase mb-4 text-electric-blue font-bold tracking-wider">
            Company
          </h3>
          <NuxtLink
            v-for="link in footerLinks1"
            :key="link.label"
            :to="link.path"
            class="text-cool-grey-1 hover:text-hyper-lime transition-colors"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
        <div class="flex flex-col max-w-fit space-y-3">
          <h3 class="uppercase mb-4 text-electric-blue font-bold tracking-wider">
            Support
          </h3>
          <NuxtLink
            v-for="link in footerLinks2"
            :key="link.label"
            :to="link.path"
            class="text-cool-grey-1 hover:text-hyper-lime transition-colors"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
        <div class="flex flex-col max-w-fit space-y-3">
          <h3 class="uppercase mb-4 text-electric-blue font-bold tracking-wider">
            Connect
          </h3>
          <NuxtLink
            v-for="link in footerLinks3"
            :key="link.label"
            :to="link.path"
            class="text-cool-grey-1 hover:text-hyper-lime transition-colors"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
        <KlaviyoNewsletter />
      </div>
      <div class="flex justify-between items-center border-t border-deep-blue-tint pt-8">
        <span class="uppercase text-sm text-cool-grey-2">© Flow Sports Nutrition 2025</span>
        <div class="flex gap-4 text-cool-grey-2 text-sm">
          <span>Fuel Your Flow</span>
          <span class="text-electric-blue">⚡</span>
        </div>
      </div>
    </nav>
    <nav class="flex flex-col p-6 gap-8 lg:hidden">
      <KlaviyoNewsletter />
      <div class="flex flex-col divide-y divide-deep-blue-tint">
        <details class="group">
          <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-ice-white">
            <span class="uppercase truncate font-bold">Company</span>
            <Icon
              name="ph:caret-down"
              class="size-5 shrink-0 transition group-open:rotate-180 text-electric-blue"
            />
          </summary>
          <div class="h-0 overflow-hidden group-open:h-auto">
            <div class="flex flex-col pb-4 space-y-2">
              <NuxtLink
                v-for="link in footerLinks1"
                :key="link.label"
                :to="link.path"
                class="text-cool-grey-1 hover:text-hyper-lime transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>
        </details>
        <details class="group">
          <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-ice-white">
            <span class="uppercase truncate font-bold">Support</span>
            <Icon
              name="ph:caret-down"
              class="size-5 shrink-0 transition group-open:rotate-180 text-electric-blue"
            />
          </summary>
          <div class="h-0 overflow-hidden group-open:h-auto">
            <div class="flex flex-col pb-4 space-y-2">
              <NuxtLink
                v-for="link in footerLinks2"
                :key="link.label"
                :to="link.path"
                class="text-cool-grey-1 hover:text-hyper-lime transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>
        </details>
        <details class="group">
          <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-ice-white">
            <span class="uppercase truncate font-bold">Connect</span>
            <Icon
              name="ph:caret-down"
              class="size-5 shrink-0 transition group-open:rotate-180 text-electric-blue"
            />
          </summary>
          <div class="h-0 overflow-hidden group-open:h-auto">
            <div class="flex flex-col pb-4 space-y-2">
              <NuxtLink
                v-for="link in footerLinks3"
                :key="link.label"
                :to="link.path"
                class="text-cool-grey-1 hover:text-hyper-lime transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>
        </details>
      </div>
      <div class="flex flex-col gap-2 border-t border-deep-blue-tint pt-6">
        <span class="uppercase text-sm text-cool-grey-2 text-center">© Flow Sports Nutrition 2025</span>
        <div class="flex justify-center gap-2 text-cool-grey-2 text-sm">
          <span>Fuel Your Flow</span>
          <span class="text-electric-blue">⚡</span>
        </div>
      </div>
    </nav>
  </footer>
</template>
