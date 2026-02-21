<script setup lang="ts">
import type { Athlete } from '~/types/athlete'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const slug = route.params.slug as string

const athletesStore = useAthletesStore()
const athlete = ref<Athlete | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    loading.value = true
    athlete.value = await athletesStore.fetchAthleteBySlug(slug)
  }
  catch {
    error.value = 'Athlete not found'
  }
  finally {
    loading.value = false
  }
})

const title = computed(() => athlete.value ? `${athlete.value.name} - Flow Sports Athletes` : 'Athlete Profile')
const description = computed(() => athlete.value?.bio || 'South African athlete profile and competition record.')

useSeoMeta({
  title: title.value,
  description: description.value,
  ogTitle: title.value,
  ogDescription: description.value,
  ogImage: athlete.value?.image_url || undefined,
})

const wins = computed(() => athlete.value?.competition_record.filter(r => r.result === 'Win').length ?? 0)
const losses = computed(() => athlete.value?.competition_record.filter(r => r.result === 'Loss').length ?? 0)
const draws = computed(() => athlete.value?.competition_record.filter(r => r.result === 'Draw').length ?? 0)

const resultClass = (result: string) => {
  if (result === 'Win') return 'text-[--hyper-lime] bg-[--hyper-lime]/10'
  if (result === 'Loss') return 'text-red-400 bg-red-400/10'
  return 'text-[--cool-grey-1] bg-[--cool-grey-1]/10'
}
</script>

<template>
  <div class="min-h-screen bg-[--deep-navy]">

    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12 text-center">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[--electric-blue] border-r-transparent" />
      <p class="text-[--cool-grey-2] mt-4">Loading athlete...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !athlete" class="container mx-auto px-4 py-12 text-center">
      <Icon name="ph:warning" class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p class="text-red-400 mb-4">{{ error || 'Athlete not found' }}</p>
      <NuxtLink to="/athletes" class="btn-primary">
        Back to Athletes
      </NuxtLink>
    </div>

    <!-- Athlete Profile -->
    <div v-else>

      <!-- Hero -->
      <div class="relative h-72 md:h-96 bg-[--charcoal-black] overflow-hidden">
        <img
          v-if="athlete.image_url"
          :src="athlete.image_url"
          :alt="athlete.name"
          class="w-full h-full object-cover object-top"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-[--deep-navy] via-[--deep-navy]/60 to-transparent" />

        <!-- Back Button -->
        <div class="absolute top-4 left-4">
          <NuxtLink
            to="/athletes"
            class="inline-flex items-center gap-2 text-[--ice-white] hover:text-[--electric-blue] transition-colors bg-black/40 rounded-lg px-3 py-2"
          >
            <Icon name="ph:arrow-left" class="w-5 h-5" />
            <span>All Athletes</span>
          </NuxtLink>
        </div>

        <!-- Name overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div class="container mx-auto">
            <span class="inline-block bg-[--electric-blue] text-white text-sm font-medium px-2 py-0.5 rounded mb-2">
              {{ athlete.sport }}
            </span>
            <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl text-[--ice-white]">
              {{ athlete.name }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-4 py-8 md:py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">

            <!-- Bio -->
            <section v-if="athlete.bio" class="bg-[--deep-blue-tint] rounded-lg p-6">
              <h2 class="font-heading text-2xl text-[--ice-white] mb-4">About</h2>
              <p class="text-[--cool-grey-2] leading-relaxed whitespace-pre-wrap">
                {{ athlete.bio }}
              </p>
            </section>

            <!-- Competition Record -->
            <section v-if="athlete.competition_record.length > 0" class="bg-[--deep-blue-tint] rounded-lg p-6">
              <h2 class="font-heading text-2xl text-[--ice-white] mb-6">Competition Record</h2>

              <!-- Record Summary -->
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="text-center bg-[--charcoal-black] rounded-lg p-4">
                  <p class="text-[--hyper-lime] font-heading text-3xl">{{ wins }}</p>
                  <p class="text-[--cool-grey-2] text-sm mt-1">Wins</p>
                </div>
                <div class="text-center bg-[--charcoal-black] rounded-lg p-4">
                  <p class="text-red-400 font-heading text-3xl">{{ losses }}</p>
                  <p class="text-[--cool-grey-2] text-sm mt-1">Losses</p>
                </div>
                <div class="text-center bg-[--charcoal-black] rounded-lg p-4">
                  <p class="text-[--cool-grey-1] font-heading text-3xl">{{ draws }}</p>
                  <p class="text-[--cool-grey-2] text-sm mt-1">Draws</p>
                </div>
              </div>

              <!-- Record Table -->
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-[--cool-grey-2]/20">
                      <th class="text-left text-[--cool-grey-1] font-medium py-2 pr-4">Result</th>
                      <th class="text-left text-[--cool-grey-1] font-medium py-2 pr-4">Opponent</th>
                      <th class="text-left text-[--cool-grey-1] font-medium py-2 pr-4">Method</th>
                      <th class="text-left text-[--cool-grey-1] font-medium py-2 pr-4">Event</th>
                      <th class="text-left text-[--cool-grey-1] font-medium py-2 pr-4">Rnd</th>
                      <th class="text-left text-[--cool-grey-1] font-medium py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(record, index) in athlete.competition_record"
                      :key="index"
                      class="border-b border-[--cool-grey-2]/10 last:border-0"
                    >
                      <td class="py-3 pr-4">
                        <span
                          class="inline-block px-2 py-0.5 rounded text-xs font-medium"
                          :class="resultClass(record.result)"
                        >
                          {{ record.result }}
                        </span>
                      </td>
                      <td class="py-3 pr-4 text-[--ice-white] font-medium">{{ record.opponent }}</td>
                      <td class="py-3 pr-4 text-[--cool-grey-2]">{{ record.method }}</td>
                      <td class="py-3 pr-4 text-[--cool-grey-2]">{{ record.event }}</td>
                      <td class="py-3 pr-4 text-[--cool-grey-2]">{{ record.round ?? '-' }}</td>
                      <td class="py-3 text-[--cool-grey-2]">{{ record.date }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-4 space-y-6">

              <!-- Details Card -->
              <div class="bg-[--deep-blue-tint] rounded-lg p-6 space-y-4">
                <h2 class="font-heading text-xl text-[--ice-white]">Details</h2>

                <div v-if="athlete.nationality" class="flex items-center gap-3">
                  <Icon name="ph:flag" class="w-5 h-5 text-[--electric-blue] flex-shrink-0" />
                  <div>
                    <p class="text-[--cool-grey-1] text-sm">Nationality</p>
                    <p class="text-[--ice-white]">{{ athlete.nationality }}</p>
                  </div>
                </div>

                <div v-if="athlete.sport" class="flex items-center gap-3">
                  <Icon name="ph:medal" class="w-5 h-5 text-[--electric-blue] flex-shrink-0" />
                  <div>
                    <p class="text-[--cool-grey-1] text-sm">Sport</p>
                    <p class="text-[--ice-white]">{{ athlete.sport }}</p>
                  </div>
                </div>

                <div v-if="athlete.weight_class" class="flex items-center gap-3">
                  <Icon name="ph:scales" class="w-5 h-5 text-[--electric-blue] flex-shrink-0" />
                  <div>
                    <p class="text-[--cool-grey-1] text-sm">Weight Class</p>
                    <p class="text-[--ice-white]">{{ athlete.weight_class }}</p>
                  </div>
                </div>

                <div v-if="athlete.team" class="flex items-center gap-3">
                  <Icon name="ph:shield" class="w-5 h-5 text-[--electric-blue] flex-shrink-0" />
                  <div>
                    <p class="text-[--cool-grey-1] text-sm">Team</p>
                    <p class="text-[--ice-white]">{{ athlete.team }}</p>
                  </div>
                </div>
              </div>

              <!-- Social Links -->
              <div
                v-if="athlete.social_links && Object.values(athlete.social_links).some(Boolean)"
                class="bg-[--deep-blue-tint] rounded-lg p-6"
              >
                <h2 class="font-heading text-xl text-[--ice-white] mb-4">Follow</h2>
                <div class="space-y-3">
                  <a
                    v-if="athlete.social_links.instagram"
                    :href="athlete.social_links.instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 text-[--cool-grey-2] hover:text-[--electric-blue] transition-colors"
                  >
                    <Icon name="ph:instagram-logo" class="w-5 h-5" />
                    <span>Instagram</span>
                  </a>
                  <a
                    v-if="athlete.social_links.twitter"
                    :href="athlete.social_links.twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 text-[--cool-grey-2] hover:text-[--electric-blue] transition-colors"
                  >
                    <Icon name="ph:x-logo" class="w-5 h-5" />
                    <span>X / Twitter</span>
                  </a>
                  <a
                    v-if="athlete.social_links.youtube"
                    :href="athlete.social_links.youtube"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 text-[--cool-grey-2] hover:text-[--electric-blue] transition-colors"
                  >
                    <Icon name="ph:youtube-logo" class="w-5 h-5" />
                    <span>YouTube</span>
                  </a>
                  <a
                    v-if="athlete.social_links.website"
                    :href="athlete.social_links.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 text-[--cool-grey-2] hover:text-[--electric-blue] transition-colors"
                  >
                    <Icon name="ph:globe" class="w-5 h-5" />
                    <span>Website</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
