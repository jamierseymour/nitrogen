<script setup lang="ts">
import type { Gym } from '~/types/gym'

definePageMeta({
  layout: 'default',
})

const gymsStore = useGymsStore()

// Fetch gyms on mount
onMounted(async () => {
  await gymsStore.fetchGyms()
})

const selectedGym = ref<Gym | null>(null)

const handleGymClick = (gym: Gym) => {
  selectedGym.value = gym
  gymsStore.selectGym(gym)
}

const handleClosePanel = () => {
  selectedGym.value = null
  gymsStore.selectGym(null)
}

const navigateToGym = (gym: Gym) => {
  navigateTo(`/gym-finder/${gym.id}`)
}

useSeoMeta({
  title: 'Gym Finder - Find Brazilian Jiu Jitsu Gyms',
  description: 'Discover Brazilian Jiu Jitsu gyms near you. View locations, schedules, pricing, and more.',
  ogTitle: 'Gym Finder - Find Brazilian Jiu Jitsu Gyms',
  ogDescription: 'Discover Brazilian Jiu Jitsu gyms near you. View locations, schedules, pricing, and more.',
})
</script>

<template>
  <div class="min-h-screen bg-[--deep-navy]">
    <!-- Header Section -->
    <div class="container mx-auto px-4 py-8 md:py-12">
      <div class="text-center mb-8">
        <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl text-[--ice-white] mb-4">
          Gym Finder
        </h1>
        <p class="text-[--cool-grey-2] text-lg md:text-xl max-w-2xl mx-auto">
          Discover Brazilian Jiu Jitsu gyms near you
        </p>
      </div>

      <!-- Admin Link -->
      <div class="flex justify-center mb-6">
        <NuxtLink
          to="/gym-finder/admin"
          class="btn-secondary inline-flex items-center gap-2"
        >
          <Icon name="ph:gear" class="w-5 h-5" />
          Manage Gyms
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="gymsStore.loading && !gymsStore.hasGyms" class="text-center py-12">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[--electric-blue] border-r-transparent" />
        <p class="text-[--cool-grey-2] mt-4">Loading gyms...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="gymsStore.error" class="text-center py-12">
        <Icon name="ph:warning" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p class="text-red-400 mb-4">{{ gymsStore.error }}</p>
        <button @click="gymsStore.fetchGyms()" class="btn-primary">
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!gymsStore.hasGyms" class="text-center py-12">
        <Icon name="ph:map-pin-plus" class="w-16 h-16 text-[--cool-grey-2] mx-auto mb-4" />
        <p class="text-[--cool-grey-2] mb-4">No gyms added yet</p>
        <NuxtLink to="/gym-finder/admin" class="btn-primary">
          Add Your First Gym
        </NuxtLink>
      </div>

      <!-- Map and List View -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Gym List Sidebar -->
        <div class="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto no-scrollbar">
          <div
            v-for="gym in gymsStore.gyms"
            :key="gym.id"
            class="bg-[--deep-blue-tint] rounded-lg p-4 cursor-pointer hover:bg-[--charcoal-black] transition-colors border border-transparent hover:border-[--electric-blue]"
            :class="{ 'border-[--electric-blue] bg-[--charcoal-black]': selectedGym?.id === gym.id }"
            @click="handleGymClick(gym)"
          >
            <!-- Gym Image -->
            <div
              v-if="gym.images.length > 0"
              class="w-full h-32 bg-[--charcoal-black] rounded-lg mb-3 overflow-hidden"
            >
              <img
                :src="gym.images[0].url"
                :alt="gym.images[0].alt"
                class="w-full h-full object-cover"
              >
            </div>

            <!-- Gym Info -->
            <h3 class="font-heading text-xl text-[--ice-white] mb-2">
              {{ gym.name }}
            </h3>
            <div class="flex items-start gap-2 text-[--cool-grey-2] text-sm mb-3">
              <Icon name="ph:map-pin" class="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{{ gym.address }}</span>
            </div>

            <!-- Contact Info -->
            <div v-if="gym.contact.phone || gym.contact.email" class="space-y-1 mb-3">
              <div v-if="gym.contact.phone" class="flex items-center gap-2 text-[--cool-grey-2] text-sm">
                <Icon name="ph:phone" class="w-4 h-4" />
                <span>{{ gym.contact.phone }}</span>
              </div>
              <div v-if="gym.contact.email" class="flex items-center gap-2 text-[--cool-grey-2] text-sm">
                <Icon name="ph:envelope" class="w-4 h-4" />
                <span>{{ gym.contact.email }}</span>
              </div>
            </div>

            <!-- View Details Button -->
            <button
              @click.stop="navigateToGym(gym)"
              class="w-full btn-primary text-sm py-2"
            >
              View Details
            </button>
          </div>
        </div>

        <!-- Map -->
        <div class="lg:col-span-2 relative">
          <div class="sticky top-4 h-[600px] bg-[--deep-blue-tint] rounded-lg overflow-hidden">
            <GymMap
              :gyms="gymsStore.gyms"
              @gym-click="handleGymClick"
            />
          </div>
        </div>
      </div>

      <!-- Selected Gym Quick View Panel -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="selectedGym"
          class="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4"
          @click.self="handleClosePanel"
        >
          <div class="bg-[--deep-blue-tint] rounded-t-xl md:rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <!-- Close Button -->
            <div class="sticky top-0 bg-[--deep-blue-tint] border-b border-[--cool-grey-2]/20 p-4 flex justify-between items-center">
              <h3 class="font-heading text-2xl text-[--ice-white]">
                {{ selectedGym.name }}
              </h3>
              <button
                @click="handleClosePanel"
                class="text-[--cool-grey-2] hover:text-[--ice-white] transition-colors"
              >
                <Icon name="ph:x" class="w-6 h-6" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-4">
              <!-- Address -->
              <div class="flex items-start gap-3">
                <Icon name="ph:map-pin" class="w-5 h-5 text-[--electric-blue] mt-0.5" />
                <div>
                  <p class="text-[--cool-grey-1] font-medium">Address</p>
                  <p class="text-[--ice-white]">{{ selectedGym.address }}</p>
                </div>
              </div>

              <!-- Description -->
              <div v-if="selectedGym.description">
                <p class="text-[--cool-grey-2]">{{ selectedGym.description }}</p>
              </div>

              <!-- Contact -->
              <div v-if="selectedGym.contact.phone || selectedGym.contact.email || selectedGym.contact.website" class="space-y-2">
                <p class="text-[--cool-grey-1] font-medium">Contact Information</p>
                <div v-if="selectedGym.contact.phone" class="flex items-center gap-2 text-[--cool-grey-2]">
                  <Icon name="ph:phone" class="w-5 h-5" />
                  <span>{{ selectedGym.contact.phone }}</span>
                </div>
                <div v-if="selectedGym.contact.email" class="flex items-center gap-2 text-[--cool-grey-2]">
                  <Icon name="ph:envelope" class="w-5 h-5" />
                  <span>{{ selectedGym.contact.email }}</span>
                </div>
                <div v-if="selectedGym.contact.website">
                  <a
                    :href="selectedGym.contact.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-2 text-[--electric-blue] hover:text-[--hyper-lime] transition-colors"
                  >
                    <Icon name="ph:globe" class="w-5 h-5" />
                    <span>Visit Website</span>
                  </a>
                </div>
              </div>

              <!-- View Full Details Button -->
              <button
                @click="navigateToGym(selectedGym)"
                class="w-full btn-primary"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
