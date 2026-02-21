<script setup lang="ts">
import type { Gym } from '~/types/gym'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const gymId = route.params.id as string

const gymsStore = useGymsStore()
const gym = ref<Gym | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Fetch gym data
onMounted(async () => {
  try {
    loading.value = true
    gym.value = await gymsStore.fetchGymById(gymId)
  }
  catch (err) {
    error.value = 'Gym not found'
    console.error(err)
  }
  finally {
    loading.value = false
  }
})

// SEO
const title = computed(() => gym.value ? `${gym.value.name} - Gym Finder` : 'Gym Details')
const description = computed(() => gym.value?.description || 'View gym details, schedule, pricing, and more.')

useSeoMeta({
  title: title.value,
  description: description.value,
  ogTitle: title.value,
  ogDescription: description.value,
})

const selectedImageIndex = ref(0)
</script>

<template>
  <div class="min-h-screen bg-[--deep-navy]">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12 text-center">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[--electric-blue] border-r-transparent" />
      <p class="text-[--cool-grey-2] mt-4">Loading gym details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !gym" class="container mx-auto px-4 py-12 text-center">
      <Icon name="ph:warning" class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p class="text-red-400 mb-4">{{ error || 'Gym not found' }}</p>
      <NuxtLink to="/gym-finder" class="btn-primary">
        Back to Gym Finder
      </NuxtLink>
    </div>

    <!-- Gym Details -->
    <div v-else class="container mx-auto px-4 py-8 md:py-12">
      <!-- Back Button -->
      <NuxtLink
        to="/gym-finder"
        class="inline-flex items-center gap-2 text-[--electric-blue] hover:text-[--hyper-lime] transition-colors mb-6"
      >
        <Icon name="ph:arrow-left" class="w-5 h-5" />
        <span>Back to Gym Finder</span>
      </NuxtLink>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl text-[--ice-white] mb-4">
          {{ gym.name }}
        </h1>
        <div class="flex items-start gap-2 text-[--cool-grey-2] text-lg">
          <Icon name="ph:map-pin" class="w-6 h-6 mt-1 flex-shrink-0" />
          <span>{{ gym.address }}</span>
        </div>
      </div>

      <!-- Image Gallery -->
      <div v-if="gym.images.length > 0" class="mb-12">
        <!-- Main Image -->
        <div class="w-full h-[400px] md:h-[500px] bg-[--charcoal-black] rounded-lg overflow-hidden mb-4">
          <img
            :src="gym.images[selectedImageIndex].url"
            :alt="gym.images[selectedImageIndex].alt"
            class="w-full h-full object-cover"
          >
        </div>

        <!-- Image Thumbnails -->
        <div v-if="gym.images.length > 1" class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          <button
            v-for="(image, index) in gym.images"
            :key="index"
            @click="selectedImageIndex = index"
            class="aspect-square rounded-lg overflow-hidden border-2 transition-all"
            :class="selectedImageIndex === index ? 'border-[--electric-blue]' : 'border-transparent hover:border-[--cool-grey-2]'"
          >
            <img
              :src="image.url"
              :alt="image.alt"
              class="w-full h-full object-cover"
            >
          </button>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Description -->
          <section v-if="gym.description" class="bg-[--deep-blue-tint] rounded-lg p-6">
            <h2 class="font-heading text-2xl text-[--ice-white] mb-4">About</h2>
            <p class="text-[--cool-grey-2] leading-relaxed whitespace-pre-wrap">
              {{ gym.description }}
            </p>
          </section>

          <!-- Schedule -->
          <section v-if="gym.schedule.length > 0" class="bg-[--deep-blue-tint] rounded-lg p-6">
            <h2 class="font-heading text-2xl text-[--ice-white] mb-4">Schedule</h2>
            <div class="space-y-3">
              <div
                v-for="(schedule, index) in gym.schedule"
                :key="index"
                class="flex justify-between items-center py-3 border-b border-[--cool-grey-2]/20 last:border-0"
              >
                <span class="text-[--cool-grey-1] font-medium">{{ schedule.day }}</span>
                <span class="text-[--ice-white]">{{ schedule.times }}</span>
              </div>
            </div>
          </section>

          <!-- Pricing -->
          <section v-if="gym.pricing.length > 0" class="bg-[--deep-blue-tint] rounded-lg p-6">
            <h2 class="font-heading text-2xl text-[--ice-white] mb-4">Pricing</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(price, index) in gym.pricing"
                :key="index"
                class="bg-[--charcoal-black] rounded-lg p-4 border border-[--cool-grey-2]/20"
              >
                <h3 class="text-[--cool-grey-1] font-medium mb-1">{{ price.type }}</h3>
                <p class="text-[--electric-blue] font-heading text-2xl mb-2">
                  ${{ price.price }}
                </p>
                <p v-if="price.description" class="text-[--cool-grey-2] text-sm">
                  {{ price.description }}
                </p>
              </div>
            </div>
          </section>

          <!-- Amenities -->
          <section v-if="gym.amenities && gym.amenities.length > 0" class="bg-[--deep-blue-tint] rounded-lg p-6">
            <h2 class="font-heading text-2xl text-[--ice-white] mb-4">Amenities</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div
                v-for="(amenity, index) in gym.amenities"
                :key="index"
                class="flex items-center gap-2 text-[--cool-grey-2]"
              >
                <Icon name="ph:check-circle" class="w-5 h-5 text-[--hyper-lime]" />
                <span>{{ amenity }}</span>
              </div>
            </div>
          </section>

          <!-- Instructors -->
          <section v-if="gym.instructors && gym.instructors.length > 0" class="bg-[--deep-blue-tint] rounded-lg p-6">
            <h2 class="font-heading text-2xl text-[--ice-white] mb-4">Instructors</h2>
            <div class="space-y-2">
              <div
                v-for="(instructor, index) in gym.instructors"
                :key="index"
                class="flex items-center gap-2 text-[--cool-grey-2]"
              >
                <Icon name="ph:user" class="w-5 h-5 text-[--electric-blue]" />
                <span>{{ instructor }}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-4 space-y-6">
            <!-- Contact Card -->
            <div class="bg-[--deep-blue-tint] rounded-lg p-6">
              <h2 class="font-heading text-xl text-[--ice-white] mb-4">Contact</h2>
              <div class="space-y-3">
                <div v-if="gym.contact.phone" class="flex items-start gap-3">
                  <Icon name="ph:phone" class="w-5 h-5 text-[--electric-blue] mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="text-[--cool-grey-1] text-sm mb-1">Phone</p>
                    <a
                      :href="`tel:${gym.contact.phone}`"
                      class="text-[--ice-white] hover:text-[--electric-blue] transition-colors"
                    >
                      {{ gym.contact.phone }}
                    </a>
                  </div>
                </div>

                <div v-if="gym.contact.email" class="flex items-start gap-3">
                  <Icon name="ph:envelope" class="w-5 h-5 text-[--electric-blue] mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="text-[--cool-grey-1] text-sm mb-1">Email</p>
                    <a
                      :href="`mailto:${gym.contact.email}`"
                      class="text-[--ice-white] hover:text-[--electric-blue] transition-colors break-all"
                    >
                      {{ gym.contact.email }}
                    </a>
                  </div>
                </div>

                <div v-if="gym.contact.website" class="flex items-start gap-3">
                  <Icon name="ph:globe" class="w-5 h-5 text-[--electric-blue] mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="text-[--cool-grey-1] text-sm mb-1">Website</p>
                    <a
                      :href="gym.contact.website"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-[--ice-white] hover:text-[--electric-blue] transition-colors break-all"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Map -->
            <div class="bg-[--deep-blue-tint] rounded-lg p-6">
              <h2 class="font-heading text-xl text-[--ice-white] mb-4">Location</h2>
              <div class="h-64 rounded-lg overflow-hidden">
                <GymMap
                  :gyms="[gym]"
                  :center="gym.location"
                  :zoom="15"
                />
              </div>
              <a
                :href="`https://www.google.com/maps/dir/?api=1&destination=${gym.location.lat},${gym.location.lng}`"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary w-full mt-4 inline-flex items-center justify-center gap-2"
              >
                <Icon name="ph:navigation-arrow" class="w-5 h-5" />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
