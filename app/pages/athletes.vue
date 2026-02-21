<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const athletesStore = useAthletesStore()

onMounted(async () => {
  await athletesStore.fetchAthletes()
})

const wins = (athlete: { competition_record: { result: string }[] }) =>
  athlete.competition_record.filter(r => r.result === 'Win').length

const losses = (athlete: { competition_record: { result: string }[] }) =>
  athlete.competition_record.filter(r => r.result === 'Loss').length

useSeoMeta({
  title: 'South African Athletes - Flow Sports',
  description: 'Meet our South African athletes. View their bios, competition records, and achievements.',
  ogTitle: 'South African Athletes - Flow Sports',
  ogDescription: 'Meet our South African athletes. View their bios, competition records, and achievements.',
})
</script>

<template>
  <div class="min-h-screen bg-[--deep-navy]">
    <div class="container mx-auto px-4 py-8 md:py-12">

      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl text-[--ice-white] mb-4">
          South African Athletes
        </h1>
        <p class="text-[--cool-grey-2] text-lg md:text-xl max-w-2xl mx-auto">
          Meet the fighters and grapplers representing South Africa on the world stage
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="athletesStore.loading && !athletesStore.hasAthletes" class="text-center py-12">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[--electric-blue] border-r-transparent" />
        <p class="text-[--cool-grey-2] mt-4">Loading athletes...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="athletesStore.error" class="text-center py-12">
        <Icon name="ph:warning" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p class="text-red-400 mb-4">{{ athletesStore.error }}</p>
        <button class="btn-primary" @click="athletesStore.fetchAthletes()">
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!athletesStore.hasAthletes" class="text-center py-12">
        <Icon name="ph:users" class="w-16 h-16 text-[--cool-grey-2] mx-auto mb-4" />
        <p class="text-[--cool-grey-2]">No athletes found. Add athletes via Supabase.</p>
      </div>

      <!-- Athletes Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="athlete in athletesStore.athletes"
          :key="athlete.id"
          :to="`/athletes/${athlete.slug}`"
          class="group bg-[--deep-blue-tint] rounded-xl overflow-hidden border border-transparent hover:border-[--electric-blue] transition-all duration-200"
        >
          <!-- Athlete Image -->
          <div class="relative h-64 bg-[--charcoal-black] overflow-hidden">
            <img
              v-if="athlete.avatar_image_url"
              :src="athlete.avatar_image_url"
              :alt="athlete.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div v-else class="w-full h-full flex items-center justify-center">
              <Icon name="ph:user" class="w-24 h-24 text-[--cool-grey-2]" />
            </div>
            <!-- Sport Badge -->
            <div class="absolute top-3 right-3 bg-[--electric-blue]/90 text-white text-xs font-medium px-2 py-1 rounded-md">
              {{ athlete.sport }}
            </div>
          </div>

          <!-- Athlete Info -->
          <div class="p-5">
            <h2 class="font-heading text-2xl text-[--ice-white] mb-1 group-hover:text-[--electric-blue] transition-colors">
              {{ athlete.name }}
            </h2>

            <div class="flex flex-wrap gap-2 mb-3">
              <span v-if="athlete.weight_classes?.length" class="flex items-center gap-1 text-[--cool-grey-2] text-sm">
                <Icon name="ph:scales" class="w-4 h-4 shrink-0" />
                {{ athlete.weight_classes.join(' · ') }}
              </span>
              <span v-if="athlete.team" class="flex items-center gap-1 text-[--cool-grey-2] text-sm">
                <Icon name="ph:shield" class="w-4 h-4" />
                {{ athlete.team }}
              </span>
            </div>

            <p v-if="athlete.bio" class="text-[--cool-grey-2] text-sm line-clamp-2 mb-4">
              {{ athlete.bio }}
            </p>

            <!-- Record -->
            <div v-if="athlete.competition_record.length > 0" class="flex gap-4 pt-3 border-t border-[--cool-grey-2]/20">
              <div class="text-center">
                <p class="text-[--hyper-lime] font-heading text-xl">{{ wins(athlete) }}</p>
                <p class="text-[--cool-grey-2] text-xs">Wins</p>
              </div>
              <div class="text-center">
                <p class="text-red-400 font-heading text-xl">{{ losses(athlete) }}</p>
                <p class="text-[--cool-grey-2] text-xs">Losses</p>
              </div>
              <div class="text-center">
                <p class="text-[--cool-grey-1] font-heading text-xl">{{ athlete.competition_record.length }}</p>
                <p class="text-[--cool-grey-2] text-xs">Bouts</p>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
