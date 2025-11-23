<template>
  <div class="flow-landing">
    <!-- Hero Section -->
    <section class="hero-section relative overflow-hidden">
      <!-- Video Background -->
      <div class="absolute inset-0 z-0">
        <video
          autoplay
          loop
          muted
          playsinline
          class="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/heros/hero-back.mp4" type="video/mp4">
        </video>
        <!-- Overlay for better text readability -->
        <div class="absolute inset-0 bg-deep-navy/70" />
      </div>

      <!-- Background Pattern (optional, adds texture) -->
      <div class="absolute inset-0 opacity-5 z-0">
        <div class="absolute inset-0 bg-line-pattern" />
      </div>

      <!-- Electric Blue Accent Stripe -->
      <div class="absolute left-0 top-0 bottom-0 w-2 gradient-electric z-10" />
      <div class="absolute right-0 top-0 bottom-0 w-2 gradient-electric z-10" />

      <div class="container mx-auto px-6 py-20 md:py-32 relative z-10">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Hero Content -->
          <div class="space-y-6">
            <div class="inline-block px-4 py-2 bg-electric-blue/10 border border-electric-blue rounded-full">
              <span class="text-electric-blue text-sm font-semibold uppercase tracking-wider">
                Premium Athletic Nutrition
              </span>
            </div>

            <h1 class="text-5xl md:text-7xl font-heading leading-tight">
              FUEL YOUR
              <span class="text-gradient-electric block">FLOW STATE</span>
            </h1>

            <p class="text-xl text-cool-grey-1 max-w-xl leading-relaxed font-body">
              Science-backed supplements engineered for athletes who demand peak performance.
              Clean ingredients. Maximum results. Zero compromises.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button class="btn-primary inline-flex items-center justify-center gap-2">
                Shop Products
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button class="btn-secondary">
                Learn More
              </button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-6 pt-8 border-t border-deep-blue-tint">
              <div>
                <div class="text-3xl font-bold text-electric-blue font-mono">25G</div>
                <div class="text-sm text-cool-grey-2 uppercase">Protein</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-hyper-lime font-mono">0G</div>
                <div class="text-sm text-cool-grey-2 uppercase">Sugar</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-electric-blue font-mono">100%</div>
                <div class="text-sm text-cool-grey-2 uppercase">Clean</div>
              </div>
            </div>
          </div>

          <!-- Hero Image / Product Showcase -->
          <div class="relative">
            <div class="relative z-10">
              <!-- Placeholder for product image -->
              <div class="aspect-square rounded-2xl bg-gradient-electric p-1">
                <div class="w-full h-full rounded-xl bg-deep-navy flex items-center justify-center">
                  <div class="text-center space-y-4">
                    <div class="w-32 h-32 mx-auto rounded-full gradient-electric opacity-20" />
                    <p class="text-cool-grey-2 text-sm">Product Image</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Floating accent elements -->
            <div class="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-hyper-lime/20 blur-2xl" />
            <div class="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-electric-blue/20 blur-2xl" />
          </div>
        </div>
      </div>

      <!-- Wave divider -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#111111"/>
        </svg>
      </div>
    </section>

    <!-- Trust Badges Section -->
    <section class="bg-charcoal py-12">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="space-y-2">
            <div class="text-electric-blue text-2xl font-bold">🏆</div>
            <div class="text-ice-white font-semibold">Lab Tested</div>
            <div class="text-cool-grey-2 text-sm">Third-party verified</div>
          </div>
          <div class="space-y-2">
            <div class="text-hyper-lime text-2xl font-bold">⚡</div>
            <div class="text-ice-white font-semibold">Fast Acting</div>
            <div class="text-cool-grey-2 text-sm">Optimized absorption</div>
          </div>
          <div class="space-y-2">
            <div class="text-electric-blue text-2xl font-bold">🌿</div>
            <div class="text-ice-white font-semibold">Clean Formula</div>
            <div class="text-cool-grey-2 text-sm">No artificial fillers</div>
          </div>
          <div class="space-y-2">
            <div class="text-hyper-lime text-2xl font-bold">💪</div>
            <div class="text-ice-white font-semibold">Athlete Approved</div>
            <div class="text-cool-grey-2 text-sm">Trusted by pros</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="bg-charcoal py-20">
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-heading mb-4">
            PERFORMANCE
            <span class="text-gradient-electric">LINEUP</span>
          </h2>
          <p class="text-cool-grey-1 text-lg max-w-2xl mx-auto font-body">
            Premium supplements designed for athletes, formulated by science
          </p>
        </div>

        <!-- Product Grid Placeholder -->
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="group">
            <div class="bg-deep-navy rounded-xl overflow-hidden border border-deep-blue-tint hover:border-electric-blue transition-all duration-300">
              <div class="aspect-square bg-gradient-electric/10 flex items-center justify-center">
                <div class="text-cool-grey-2">Product {{ i }}</div>
              </div>
              <div class="p-6 space-y-3">
                <div class="text-sm text-electric-blue uppercase tracking-wider font-semibold">Pre-Workout</div>
                <h3 class="text-xl font-bold text-ice-white">Flow Energy</h3>
                <p class="text-cool-grey-2 text-sm">Explosive energy for peak performance</p>
                <div class="flex items-center justify-between pt-3">
                  <span class="text-2xl font-bold text-ice-white">$49.99</span>
                  <button class="px-4 py-2 bg-electric-blue text-ice-white rounded-lg hover:bg-hyper-lime hover:text-charcoal transition-all font-semibold text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <button class="btn-secondary">
            View All Products
          </button>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative py-20 overflow-hidden">
      <div class="absolute inset-0 gradient-electric opacity-95" />
      <div class="absolute inset-0 bg-line-pattern opacity-5" />

      <div class="container mx-auto px-6 relative z-10">
        <div class="max-w-3xl mx-auto text-center space-y-6">
          <h2 class="text-4xl md:text-5xl font-heading text-charcoal">
            JOIN THE FLOW MOVEMENT
          </h2>
          <p class="text-xl text-deep-navy leading-relaxed font-body">
            Get exclusive access to new products, athlete stories, and performance tips. Plus 15% off your first order.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <input
              type="email"
              placeholder="Enter your email"
              class="px-6 py-4 rounded-lg bg-ice-white text-charcoal border-2 border-transparent focus:border-charcoal outline-none text-lg"
            >
            <button class="px-8 py-4 bg-charcoal text-ice-white rounded-lg hover:bg-deep-navy transition-all font-bold text-lg uppercase">
              Get Started
            </button>
          </div>
          <p class="text-sm text-deep-navy/80">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>

    <!-- Athletes Section -->
    <section class="bg-deep-navy py-20">
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-heading mb-4">
            BUILT FOR
            <span class="text-gradient-electric">CHAMPIONS</span>
          </h2>
          <p class="text-cool-grey-1 text-lg font-body">
            Trusted by athletes across MMA, Jiu-Jitsu, CrossFit, and beyond
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="sport in ['MMA', 'JIU-JITSU', 'CROSSFIT']" :key="sport" class="text-center">
            <div class="w-24 h-24 mx-auto mb-4 rounded-full gradient-electric flex items-center justify-center">
              <span class="text-3xl font-bold text-charcoal font-mono">{{ sport[0] }}</span>
            </div>
            <h3 class="text-xl font-bold text-ice-white mb-2">{{ sport }}</h3>
            <p class="text-cool-grey-2">Peak performance fuel for intense training</p>
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
</script>

<style scoped>
.hero-section {
  background: linear-gradient(180deg, var(--deep-navy) 0%, var(--charcoal-black) 100%);
  min-height: 90vh;
}

/* Add custom animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.hero-section .aspect-square {
  animation: float 6s ease-in-out infinite;
}
</style>
