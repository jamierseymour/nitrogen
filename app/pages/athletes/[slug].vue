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

const title = computed(() => athlete.value ? `${athlete.value.name} - Flow Sports` : 'Athlete Profile')
const description = computed(() => athlete.value?.bio || 'South African athlete profile and competition record.')

useSeoMeta({
  title: title.value,
  description: description.value,
  ogTitle: title.value,
  ogDescription: description.value,
  ogImage: athlete.value?.avatar_image_url || undefined,
})

const wins = computed(() => athlete.value?.competition_record.filter(r => r.result === 'Win').length ?? 0)
const losses = computed(() => athlete.value?.competition_record.filter(r => r.result === 'Loss').length ?? 0)
const draws = computed(() => athlete.value?.competition_record.filter(r => r.result === 'Draw').length ?? 0)
const totalFights = computed(() => (athlete.value?.competition_record.length ?? 0))
const winRate = computed(() => totalFights.value > 0 ? Math.round((wins.value / totalFights.value) * 100) : 0)

const resultClass = (result: string) => {
  if (result === 'Win') return 'text-[--hyper-lime] bg-[--hyper-lime]/10 border border-[--hyper-lime]/20'
  if (result === 'Loss') return 'text-red-400 bg-red-400/10 border border-red-400/20'
  return 'text-[--cool-grey-1] bg-[--cool-grey-1]/10 border border-[--cool-grey-1]/20'
}

const rowClass = (result: string) => {
  if (result === 'Win') return 'border-l-2 border-l-[--hyper-lime]'
  if (result === 'Loss') return 'border-l-2 border-l-red-400'
  return 'border-l-2 border-l-[--cool-grey-2]/30'
}
</script>

<template>
  <div class="min-h-screen bg-[--deep-navy]">

    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-24 text-center">
      <div class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-[--electric-blue] border-r-transparent" />
      <p class="text-[--cool-grey-2] mt-4 text-lg">Loading athlete...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !athlete" class="container mx-auto px-4 py-24 text-center">
      <Icon name="ph:warning-circle" class="w-20 h-20 text-red-500 mx-auto mb-6" />
      <p class="text-red-400 text-xl mb-6">{{ error || 'Athlete not found' }}</p>
      <NuxtLink to="/athletes" class="btn-primary">
        Back to Athletes
      </NuxtLink>
    </div>

    <!-- Athlete Profile -->
    <div v-else>

      <!-- ── Hero ─────────────────────────────────────────────────────────── -->
      <div class="relative min-h-[480px] md:min-h-[560px] bg-[--charcoal-black] overflow-hidden flex flex-col justify-end">

        <!-- Cover image -->
        <img
          v-if="athlete.cover_image_url"
          :src="athlete.cover_image_url"
          :alt="athlete.name"
          class="absolute inset-0 w-full h-full object-cover object-top"
        >

        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-linear-to-t from-[--deep-navy] via-[--deep-navy]/70 to-[--deep-navy]/20" />

        <!-- Back button -->
        <div class="absolute top-5 left-5 z-10">
          <NuxtLink
            to="/athletes"
            class="inline-flex items-center gap-2 text-[--ice-white]/80 hover:text-[--ice-white] transition-colors bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 text-sm"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4" />
            <span>All Athletes</span>
          </NuxtLink>
        </div>

        <!-- Hero content -->
        <div class="relative container mx-auto px-4 pb-10 md:pb-14 pt-24">
          <div class="flex flex-col md:flex-row md:items-end gap-6">

            <!-- Avatar -->
            <div
              v-if="athlete.avatar_image_url"
              class="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-white/20 shrink-0 shadow-2xl"
            >
              <img :src="athlete.avatar_image_url" :alt="athlete.name" class="w-full h-full object-cover">
            </div>

            <!-- Name + meta -->
            <div class="flex-1">
              <!-- Sport badge -->
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span class="inline-flex items-center gap-1.5 bg-[--electric-blue] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                  <Icon name="ph:medal" class="w-3.5 h-3.5" />
                  {{ athlete.sport }}
                </span>
                <span v-if="athlete.nationality" class="inline-flex items-center gap-1.5 bg-white/10 text-[--ice-white] text-xs px-3 py-1 rounded-full">
                  <Icon name="ph:flag" class="w-3.5 h-3.5" />
                  {{ athlete.nationality }}
                </span>
                <span v-if="athlete.team" class="inline-flex items-center gap-1.5 bg-white/10 text-[--ice-white] text-xs px-3 py-1 rounded-full">
                  <Icon name="ph:shield-chevron" class="w-3.5 h-3.5" />
                  {{ athlete.team }}
                </span>
              </div>

              <!-- Name -->
              <h1 class="font-heading text-4xl md:text-6xl lg:text-7xl text-[--ice-white] leading-none mb-4">
                {{ athlete.name }}
              </h1>

              <!-- W / L / D record -->
              <div v-if="totalFights > 0" class="flex items-center gap-1 flex-wrap">
                <div class="flex items-baseline gap-1.5">
                  <span class="font-heading text-4xl md:text-5xl text-[--hyper-lime]">{{ wins }}</span>
                  <span class="text-[--cool-grey-2] text-sm font-medium uppercase tracking-widest">W</span>
                </div>
                <span class="text-[--cool-grey-2]/40 text-3xl font-thin mx-2">–</span>
                <div class="flex items-baseline gap-1.5">
                  <span class="font-heading text-4xl md:text-5xl text-red-400">{{ losses }}</span>
                  <span class="text-[--cool-grey-2] text-sm font-medium uppercase tracking-widest">L</span>
                </div>
                <template v-if="draws > 0">
                  <span class="text-[--cool-grey-2]/40 text-3xl font-thin mx-2">–</span>
                  <div class="flex items-baseline gap-1.5">
                    <span class="font-heading text-4xl md:text-5xl text-[--cool-grey-1]">{{ draws }}</span>
                    <span class="text-[--cool-grey-2] text-sm font-medium uppercase tracking-widest">D</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Content ──────────────────────────────────────────────────────── -->
      <div class="container mx-auto px-4 py-10 md:py-14">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Main column -->
          <div class="lg:col-span-2 space-y-8">

            <!-- Quick stats bar (only if there are fights) -->
            <div v-if="totalFights > 0" class="grid grid-cols-4 gap-3">
              <div class="bg-[--deep-blue-tint] rounded-xl p-4 text-center">
                <p class="font-heading text-2xl md:text-3xl text-[--hyper-lime]">{{ wins }}</p>
                <p class="text-[--cool-grey-2] text-xs mt-1 uppercase tracking-wide">Wins</p>
              </div>
              <div class="bg-[--deep-blue-tint] rounded-xl p-4 text-center">
                <p class="font-heading text-2xl md:text-3xl text-red-400">{{ losses }}</p>
                <p class="text-[--cool-grey-2] text-xs mt-1 uppercase tracking-wide">Losses</p>
              </div>
              <div class="bg-[--deep-blue-tint] rounded-xl p-4 text-center">
                <p class="font-heading text-2xl md:text-3xl text-[--cool-grey-1]">{{ draws }}</p>
                <p class="text-[--cool-grey-2] text-xs mt-1 uppercase tracking-wide">Draws</p>
              </div>
              <div class="bg-[--deep-blue-tint] rounded-xl p-4 text-center">
                <p class="font-heading text-2xl md:text-3xl text-[--electric-blue]">{{ winRate }}%</p>
                <p class="text-[--cool-grey-2] text-xs mt-1 uppercase tracking-wide">Win Rate</p>
              </div>
            </div>

            <!-- Bio -->
            <section v-if="athlete.bio" class="bg-[--deep-blue-tint] rounded-xl p-6 md:p-8">
              <h2 class="font-heading text-2xl text-[--ice-white] mb-4">About</h2>
              <p class="text-[--cool-grey-2] leading-relaxed whitespace-pre-wrap text-base">
                {{ athlete.bio }}
              </p>
            </section>

            <!-- Competition Record -->
            <section v-if="athlete.competition_record.length > 0" class="bg-[--deep-blue-tint] rounded-xl p-6 md:p-8">
              <h2 class="font-heading text-2xl text-[--ice-white] mb-6">Competition Record</h2>

              <!-- Win rate bar -->
              <div class="mb-6">
                <div class="flex justify-between text-xs text-[--cool-grey-2] mb-2">
                  <span>{{ wins }} Wins</span>
                  <span>{{ totalFights }} Fights</span>
                </div>
                <div class="h-2 bg-[--charcoal-black] rounded-full overflow-hidden">
                  <div
                    class="h-full bg-[--hyper-lime] rounded-full transition-all duration-700"
                    :style="{ width: `${winRate}%` }"
                  />
                </div>
              </div>

              <!-- Record rows -->
              <div class="space-y-2">
                <div
                  v-for="(record, index) in athlete.competition_record"
                  :key="index"
                  class="rounded-lg bg-[--charcoal-black] px-4 py-3 pl-5"
                  :class="rowClass(record.result)"
                >
                  <div class="flex items-center gap-3 flex-wrap">
                    <!-- Result badge -->
                    <span
                      class="inline-block px-2.5 py-0.5 rounded text-xs font-semibold shrink-0"
                      :class="resultClass(record.result)"
                    >
                      {{ record.result }}
                    </span>

                    <!-- vs Opponent -->
                    <span class="text-[--ice-white] font-semibold text-sm">
                      vs {{ record.opponent }}
                    </span>

                    <!-- Method -->
                    <span class="text-[--electric-blue] text-sm">
                      {{ record.method }}
                    </span>

                    <!-- Spacer -->
                    <div class="flex-1" />

                    <!-- Meta -->
                    <div class="flex items-center gap-3 text-xs text-[--cool-grey-2] shrink-0">
                      <span v-if="record.round">Rd {{ record.round }}</span>
                      <span v-if="record.date">{{ record.date }}</span>
                    </div>
                  </div>

                  <!-- Event -->
                  <p v-if="record.event" class="text-[--cool-grey-2] text-xs mt-1.5 ml-0">
                    {{ record.event }}
                  </p>
                </div>
              </div>
            </section>

          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-6 space-y-5">

              <!-- Details card -->
              <div class="bg-[--deep-blue-tint] rounded-xl p-6 space-y-4">
                <h2 class="font-heading text-lg text-[--ice-white] pb-2 border-b border-white/10">Fighter Details</h2>

                <div v-if="athlete.nationality" class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[--electric-blue]/10 flex items-center justify-center shrink-0">
                    <Icon name="ph:flag" class="w-4 h-4 text-[--electric-blue]" />
                  </div>
                  <div>
                    <p class="text-[--cool-grey-2] text-xs uppercase tracking-wide">Nationality</p>
                    <p class="text-[--ice-white] text-sm font-medium">{{ athlete.nationality }}</p>
                  </div>
                </div>

                <div v-if="athlete.age" class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[--electric-blue]/10 flex items-center justify-center shrink-0">
                    <Icon name="ph:calendar" class="w-4 h-4 text-[--electric-blue]" />
                  </div>
                  <div>
                    <p class="text-[--cool-grey-2] text-xs uppercase tracking-wide">Age</p>
                    <p class="text-[--ice-white] text-sm font-medium">{{ athlete.age }}</p>
                  </div>
                </div>

                <div v-if="athlete.sport" class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[--electric-blue]/10 flex items-center justify-center shrink-0">
                    <Icon name="ph:medal" class="w-4 h-4 text-[--electric-blue]" />
                  </div>
                  <div>
                    <p class="text-[--cool-grey-2] text-xs uppercase tracking-wide">Sport</p>
                    <p class="text-[--ice-white] text-sm font-medium">{{ athlete.sport }}</p>
                  </div>
                </div>

                <div v-if="athlete.team" class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[--electric-blue]/10 flex items-center justify-center shrink-0">
                    <Icon name="ph:shield-chevron" class="w-4 h-4 text-[--electric-blue]" />
                  </div>
                  <div>
                    <p class="text-[--cool-grey-2] text-xs uppercase tracking-wide">Team / Gym</p>
                    <p class="text-[--ice-white] text-sm font-medium">{{ athlete.team }}</p>
                  </div>
                </div>

                <div v-if="athlete.weight_classes?.length" class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[--electric-blue]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="ph:scales" class="w-4 h-4 text-[--electric-blue]" />
                  </div>
                  <div>
                    <p class="text-[--cool-grey-2] text-xs uppercase tracking-wide mb-1.5">Weight Class</p>
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="wc in athlete.weight_classes"
                        :key="wc"
                        class="text-xs bg-[--electric-blue]/10 text-[--electric-blue] border border-[--electric-blue]/20 px-2 py-0.5 rounded-full"
                      >
                        {{ wc }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Social links -->
              <div
                v-if="athlete.social_links && Object.values(athlete.social_links).some(Boolean)"
                class="bg-[--deep-blue-tint] rounded-xl p-6"
              >
                <h2 class="font-heading text-lg text-[--ice-white] pb-2 border-b border-white/10 mb-4">Follow</h2>
                <div class="space-y-2">
                  <a
                    v-if="athlete.social_links.instagram"
                    :href="athlete.social_links.instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 text-[--cool-grey-2] hover:text-[--ice-white] hover:bg-white/5 transition-all rounded-lg px-3 py-2.5 -mx-3"
                  >
                    <Icon name="ph:instagram-logo" class="w-5 h-5 text-pink-400" />
                    <span class="text-sm">Instagram</span>
                    <Icon name="ph:arrow-square-out" class="w-3.5 h-3.5 ml-auto opacity-50" />
                  </a>
                  <a
                    v-if="athlete.social_links.twitter"
                    :href="athlete.social_links.twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 text-[--cool-grey-2] hover:text-[--ice-white] hover:bg-white/5 transition-all rounded-lg px-3 py-2.5 -mx-3"
                  >
                    <Icon name="ph:x-logo" class="w-5 h-5" />
                    <span class="text-sm">X / Twitter</span>
                    <Icon name="ph:arrow-square-out" class="w-3.5 h-3.5 ml-auto opacity-50" />
                  </a>
                  <a
                    v-if="athlete.social_links.youtube"
                    :href="athlete.social_links.youtube"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 text-[--cool-grey-2] hover:text-[--ice-white] hover:bg-white/5 transition-all rounded-lg px-3 py-2.5 -mx-3"
                  >
                    <Icon name="ph:youtube-logo" class="w-5 h-5 text-red-400" />
                    <span class="text-sm">YouTube</span>
                    <Icon name="ph:arrow-square-out" class="w-3.5 h-3.5 ml-auto opacity-50" />
                  </a>
                  <a
                    v-if="athlete.social_links.website"
                    :href="athlete.social_links.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 text-[--cool-grey-2] hover:text-[--ice-white] hover:bg-white/5 transition-all rounded-lg px-3 py-2.5 -mx-3"
                  >
                    <Icon name="ph:globe" class="w-5 h-5 text-[--electric-blue]" />
                    <span class="text-sm">Website</span>
                    <Icon name="ph:arrow-square-out" class="w-3.5 h-3.5 ml-auto opacity-50" />
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
