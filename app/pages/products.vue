<template>
  <div class="coming-soon-page">
    <!-- Hero Section with Background Pattern -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-deep-navy via-charcoal to-deep-navy">
      <!-- Background Elements -->
      <div class="absolute inset-0 bg-line-pattern opacity-5" />
      <div class="absolute left-0 top-0 bottom-0 w-2 gradient-electric" />
      <div class="absolute right-0 top-0 bottom-0 w-2 gradient-electric" />

      <!-- Floating Accent Elements -->
      <div class="absolute top-20 left-20 w-64 h-64 rounded-full bg-electric-blue/10 blur-3xl animate-pulse" />
      <div class="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-lime/10 blur-3xl animate-pulse" style="animation-delay: 1s;" />

      <!-- Content -->
      <div class="container mx-auto px-6 relative z-10">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <!-- Badge -->
          <div class="inline-block px-4 py-2 bg-electric-blue/10 border border-electric-blue rounded-full mb-4">
            <span class="text-electric-blue text-sm font-semibold uppercase tracking-wider">
              Coming Soon
            </span>
          </div>

          <!-- Main Heading -->
          <h1 class="text-6xl md:text-8xl font-heading leading-tight">
            PRODUCTS
            <span class="text-gradient-electric block">LAUNCHING SOON</span>
          </h1>

          <!-- Description -->
          <p class="text-xl md:text-2xl text-cool-grey-1 leading-relaxed font-body max-w-2xl mx-auto">
            We're putting the finishing touches on our premium lineup of performance supplements.
            Get ready to fuel your flow state.
          </p>

          <!-- Features Grid -->
          <div class="grid md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            <div class="bg-deep-navy/50 backdrop-blur-sm rounded-xl p-6 border border-electric-blue/20">
              <div class="w-12 h-12 mx-auto mb-4 rounded-full gradient-electric flex items-center justify-center">
                <span class="text-2xl">🔬</span>
              </div>
              <h3 class="text-lg font-heading text-ice-white mb-2">Science-Backed</h3>
              <p class="text-cool-grey-2 text-sm">Rigorously tested formulations</p>
            </div>

            <div class="bg-deep-navy/50 backdrop-blur-sm rounded-xl p-6 border border-lime/20">
              <div class="w-12 h-12 mx-auto mb-4 rounded-full gradient-lime flex items-center justify-center">
                <span class="text-2xl">🌿</span>
              </div>
              <h3 class="text-lg font-heading text-ice-white mb-2">Clean Ingredients</h3>
              <p class="text-cool-grey-2 text-sm">No fillers or compromises</p>
            </div>

            <div class="bg-deep-navy/50 backdrop-blur-sm rounded-xl p-6 border border-electric-blue/20">
              <div class="w-12 h-12 mx-auto mb-4 rounded-full gradient-electric flex items-center justify-center">
                <span class="text-2xl">⚡</span>
              </div>
              <h3 class="text-lg font-heading text-ice-white mb-2">Peak Performance</h3>
              <p class="text-cool-grey-2 text-sm">Built for champions</p>
            </div>
          </div>

          <!-- CTA Section -->
          <div class="pt-12 space-y-6">
            <p class="text-cool-grey-1 font-body">
              Want to be the first to know when we launch?
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                class="flex-1 px-6 py-4 rounded-lg bg-deep-navy border-2 border-electric-blue/30 focus:border-electric-blue text-ice-white placeholder-cool-grey-2 outline-none"
              >
              <button class="btn-primary whitespace-nowrap">
                Notify Me
              </button>
            </div>

            <p class="text-sm text-cool-grey-2">Join the Flow Sports community and get early access</p>
          </div>

          <!-- Back to Home -->
          <div class="pt-8">
            <NuxtLink
              to="/"
              class="inline-flex items-center gap-2 text-electric-blue hover:text-lime transition-colors font-semibold"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Countdown Timer (Optional - can be activated later) -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div class="flex gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-electric-blue font-mono">--</div>
            <div class="text-xs text-cool-grey-2 uppercase mt-1">Days</div>
          </div>
          <div class="text-cool-grey-2 text-3xl">:</div>
          <div class="text-center">
            <div class="text-3xl font-bold text-electric-blue font-mono">--</div>
            <div class="text-xs text-cool-grey-2 uppercase mt-1">Hours</div>
          </div>
          <div class="text-cool-grey-2 text-3xl">:</div>
          <div class="text-center">
            <div class="text-3xl font-bold text-electric-blue font-mono">--</div>
            <div class="text-xs text-cool-grey-2 uppercase mt-1">Min</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Products Coming Soon',
  meta: [
    {
      name: 'description',
      content: 'Flow Sports Nutrition premium supplements launching soon. Science-backed formulations for peak athletic performance. Sign up for early access.',
    },
  ],
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 4s ease-in-out infinite;
}
</style>
