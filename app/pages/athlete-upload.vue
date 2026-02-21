<script setup lang="ts">
import type { Athlete, CompetitionRecord } from '~/types/athlete'

definePageMeta({
  layout: 'default',
})

const athletesStore = useAthletesStore()

onMounted(async () => {
  await athletesStore.fetchAthletes()
})

// ─── Form state ────────────────────────────────────────────────────────────

const showForm = ref(false)
const editingSlug = ref<string | null>(null)
const submitError = ref<string | null>(null)
const submitting = ref(false)

const blankForm = () => ({
  name: '',
  slug: '',
  sport: 'Brazilian Jiu-Jitsu',
  bio: '',
  image_url: '',
  nationality: 'South African',
  weight_class: '',
  team: '',
  social_links: {
    instagram: '',
    twitter: '',
    youtube: '',
    website: '',
  },
  competition_record: [] as CompetitionRecord[],
})

const formData = ref(blankForm())

// Auto-generate slug from name
watch(() => formData.value.name, (name) => {
  if (!editingSlug.value) {
    formData.value.slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
})

// ─── Competition record ────────────────────────────────────────────────────

const blankRecord = () => ({
  event: '',
  date: '',
  opponent: '',
  result: 'Win' as CompetitionRecord['result'],
  method: '',
  round: null as number | null,
  notes: '',
})

const recordForm = ref(blankRecord())

const addRecord = () => {
  if (!recordForm.value.event || !recordForm.value.opponent || !recordForm.value.method) return
  formData.value.competition_record.push({ ...recordForm.value })
  recordForm.value = blankRecord()
}

const removeRecord = (index: number) => {
  formData.value.competition_record.splice(index, 1)
}

// ─── Open / close ──────────────────────────────────────────────────────────

const openCreate = () => {
  editingSlug.value = null
  formData.value = blankForm()
  submitError.value = null
  showForm.value = true
}

const openEdit = (athlete: Athlete) => {
  editingSlug.value = athlete.slug
  formData.value = {
    name: athlete.name,
    slug: athlete.slug,
    sport: athlete.sport,
    bio: athlete.bio || '',
    image_url: athlete.image_url || '',
    nationality: athlete.nationality,
    weight_class: athlete.weight_class || '',
    team: athlete.team || '',
    social_links: {
      instagram: athlete.social_links?.instagram || '',
      twitter: athlete.social_links?.twitter || '',
      youtube: athlete.social_links?.youtube || '',
      website: athlete.social_links?.website || '',
    },
    competition_record: athlete.competition_record.map(r => ({ ...r })),
  }
  submitError.value = null
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingSlug.value = null
}

// ─── Submit ────────────────────────────────────────────────────────────────

const handleSubmit = async () => {
  submitting.value = true
  submitError.value = null

  try {
    const payload = {
      ...formData.value,
      social_links: Object.fromEntries(
        Object.entries(formData.value.social_links).filter(([, v]) => v),
      ),
      competition_record: formData.value.competition_record,
    }

    if (editingSlug.value) {
      await athletesStore.updateAthlete(editingSlug.value, payload as Omit<Athlete, 'id' | 'created_at' | 'updated_at'>)
    }
    else {
      await athletesStore.createAthlete(payload as Omit<Athlete, 'id' | 'created_at' | 'updated_at'>)
    }

    closeForm()
  }
  catch (err: unknown) {
    submitError.value = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
  }
  finally {
    submitting.value = false
  }
}

// ─── Delete ────────────────────────────────────────────────────────────────

const handleDelete = async (athlete: Athlete) => {
  if (!confirm(`Delete "${athlete.name}"? This cannot be undone.`)) return

  try {
    await athletesStore.deleteAthlete(athlete.slug)
  }
  catch {
    // error shown by store
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const wins = (athlete: Athlete) => athlete.competition_record.filter(r => r.result === 'Win').length
const losses = (athlete: Athlete) => athlete.competition_record.filter(r => r.result === 'Loss').length

useSeoMeta({
  title: 'Athlete Upload - Flow Sports Admin',
  description: 'Add and manage South African athletes.',
})
</script>

<template>
  <div class="min-h-screen bg-[--deep-navy]">
    <div class="container mx-auto px-4 py-8 md:py-12">

      <!-- Header -->
      <div class="mb-8">
        <NuxtLink
          to="/athletes"
          class="inline-flex items-center gap-2 text-[--electric-blue] hover:text-[--hyper-lime] transition-colors mb-4"
        >
          <Icon name="ph:arrow-left" class="w-5 h-5" />
          <span>Back to Athletes</span>
        </NuxtLink>

        <div class="flex justify-between items-center">
          <h1 class="font-heading text-4xl md:text-5xl text-[--ice-white]">
            Athlete Upload
          </h1>
          <button class="btn-primary inline-flex items-center gap-2" @click="openCreate">
            <Icon name="ph:plus" class="w-5 h-5" />
            Add Athlete
          </button>
        </div>
      </div>

      <!-- Global error from store -->
      <div v-if="athletesStore.error" class="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
        <Icon name="ph:warning" class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <p class="text-red-400">{{ athletesStore.error }}</p>
      </div>

      <!-- Loading -->
      <div v-if="athletesStore.loading && !athletesStore.hasAthletes" class="text-center py-12">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[--electric-blue] border-r-transparent" />
        <p class="text-[--cool-grey-2] mt-4">Loading...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="!athletesStore.hasAthletes" class="text-center py-12">
        <Icon name="ph:users-three" class="w-16 h-16 text-[--cool-grey-2] mx-auto mb-4" />
        <p class="text-[--cool-grey-2] mb-4">No athletes yet. Add your first one.</p>
        <button class="btn-primary" @click="openCreate">
          Add Athlete
        </button>
      </div>

      <!-- Athletes list -->
      <div v-else class="space-y-4">
        <div
          v-for="athlete in athletesStore.athletes"
          :key="athlete.id"
          class="bg-[--deep-blue-tint] rounded-lg p-5 flex items-center gap-4"
        >
          <!-- Thumbnail -->
          <div class="w-16 h-16 rounded-lg overflow-hidden bg-[--charcoal-black] flex-shrink-0">
            <img
              v-if="athlete.image_url"
              :src="athlete.image_url"
              :alt="athlete.name"
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full flex items-center justify-center">
              <Icon name="ph:user" class="w-8 h-8 text-[--cool-grey-2]" />
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h3 class="font-heading text-xl text-[--ice-white] truncate">
              {{ athlete.name }}
            </h3>
            <div class="flex flex-wrap gap-x-4 gap-y-1 mt-1">
              <span class="text-[--cool-grey-2] text-sm">{{ athlete.sport }}</span>
              <span v-if="athlete.weight_class" class="text-[--cool-grey-2] text-sm">{{ athlete.weight_class }}</span>
              <span class="text-[--cool-grey-2] text-sm">
                <span class="text-[--hyper-lime]">{{ wins(athlete) }}W</span>
                &nbsp;
                <span class="text-red-400">{{ losses(athlete) }}L</span>
              </span>
            </div>
            <p class="text-[--cool-grey-2] text-xs mt-1 font-mono">/athletes/{{ athlete.slug }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 flex-shrink-0">
            <NuxtLink
              :to="`/athletes/${athlete.slug}`"
              class="btn-secondary py-2 px-3"
              title="View public profile"
            >
              <Icon name="ph:arrow-square-out" class="w-5 h-5" />
            </NuxtLink>
            <button
              class="btn-secondary py-2 px-3"
              title="Edit"
              @click="openEdit(athlete)"
            >
              <Icon name="ph:pencil" class="w-5 h-5" />
            </button>
            <button
              class="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors"
              title="Delete"
              @click="handleDelete(athlete)"
            >
              <Icon name="ph:trash" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- ─── Form Modal ──────────────────────────────────────────────────── -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showForm"
        class="fixed inset-0 bg-black/60 z-50 overflow-y-auto"
        @click.self="closeForm"
      >
        <div class="min-h-screen flex items-start justify-center p-4 py-8">
          <form
            class="bg-[--deep-blue-tint] rounded-xl max-w-3xl w-full"
            @submit.prevent="handleSubmit"
          >

            <!-- Modal header -->
            <div class="sticky top-0 bg-[--deep-blue-tint] border-b border-[--cool-grey-2]/20 p-6 flex justify-between items-center rounded-t-xl z-10">
              <h2 class="font-heading text-2xl text-[--ice-white]">
                {{ editingSlug ? 'Edit Athlete' : 'Add New Athlete' }}
              </h2>
              <button
                type="button"
                class="text-[--cool-grey-2] hover:text-[--ice-white] transition-colors"
                @click="closeForm"
              >
                <Icon name="ph:x" class="w-6 h-6" />
              </button>
            </div>

            <!-- Form body -->
            <div class="p-6 space-y-8">

              <!-- ── Basic Info ── -->
              <section class="space-y-4">
                <h3 class="text-[--cool-grey-1] font-medium text-lg border-b border-[--cool-grey-2]/20 pb-2">
                  Basic Information
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[--cool-grey-1] text-sm mb-1">Name *</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      required
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Dricus du Plessis"
                    >
                  </div>

                  <div>
                    <label class="block text-[--cool-grey-1] text-sm mb-1">Slug *</label>
                    <input
                      v-model="formData.slug"
                      type="text"
                      required
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue] font-mono text-sm"
                      placeholder="dricus-du-plessis"
                    >
                    <p class="text-[--cool-grey-2] text-xs mt-1">Auto-generated from name. Must be unique.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[--cool-grey-1] text-sm mb-1">Sport *</label>
                    <input
                      v-model="formData.sport"
                      type="text"
                      required
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Brazilian Jiu-Jitsu"
                    >
                  </div>

                  <div>
                    <label class="block text-[--cool-grey-1] text-sm mb-1">Nationality</label>
                    <input
                      v-model="formData.nationality"
                      type="text"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="South African"
                    >
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[--cool-grey-1] text-sm mb-1">Weight Class</label>
                    <input
                      v-model="formData.weight_class"
                      type="text"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Middleweight (185 lbs)"
                    >
                  </div>

                  <div>
                    <label class="block text-[--cool-grey-1] text-sm mb-1">Team / Gym</label>
                    <input
                      v-model="formData.team"
                      type="text"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Team name"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-[--cool-grey-1] text-sm mb-1">Profile Image URL</label>
                  <input
                    v-model="formData.image_url"
                    type="url"
                    class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                    placeholder="https://..."
                  >
                  <!-- Image preview -->
                  <div v-if="formData.image_url" class="mt-3 w-32 h-32 rounded-lg overflow-hidden bg-[--charcoal-black]">
                    <img
                      :src="formData.image_url"
                      alt="Preview"
                      class="w-full h-full object-cover"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-[--cool-grey-1] text-sm mb-1">Bio</label>
                  <textarea
                    v-model="formData.bio"
                    rows="5"
                    class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue] resize-y"
                    placeholder="Athlete biography..."
                  />
                </div>
              </section>

              <!-- ── Social Links ── -->
              <section class="space-y-4">
                <h3 class="text-[--cool-grey-1] font-medium text-lg border-b border-[--cool-grey-2]/20 pb-2">
                  Social Links
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="flex items-center gap-2 text-[--cool-grey-1] text-sm mb-1">
                      <Icon name="ph:instagram-logo" class="w-4 h-4" /> Instagram
                    </label>
                    <input
                      v-model="formData.social_links.instagram"
                      type="url"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="https://instagram.com/..."
                    >
                  </div>

                  <div>
                    <label class="flex items-center gap-2 text-[--cool-grey-1] text-sm mb-1">
                      <Icon name="ph:x-logo" class="w-4 h-4" /> X / Twitter
                    </label>
                    <input
                      v-model="formData.social_links.twitter"
                      type="url"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="https://x.com/..."
                    >
                  </div>

                  <div>
                    <label class="flex items-center gap-2 text-[--cool-grey-1] text-sm mb-1">
                      <Icon name="ph:youtube-logo" class="w-4 h-4" /> YouTube
                    </label>
                    <input
                      v-model="formData.social_links.youtube"
                      type="url"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="https://youtube.com/@..."
                    >
                  </div>

                  <div>
                    <label class="flex items-center gap-2 text-[--cool-grey-1] text-sm mb-1">
                      <Icon name="ph:globe" class="w-4 h-4" /> Website
                    </label>
                    <input
                      v-model="formData.social_links.website"
                      type="url"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="https://..."
                    >
                  </div>
                </div>
              </section>

              <!-- ── Competition Record ── -->
              <section class="space-y-4">
                <h3 class="text-[--cool-grey-1] font-medium text-lg border-b border-[--cool-grey-2]/20 pb-2">
                  Competition Record
                </h3>

                <!-- Add record form -->
                <div class="bg-[--charcoal-black] rounded-lg p-4 space-y-3">
                  <p class="text-[--cool-grey-1] text-sm font-medium">Add a Result</p>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[--cool-grey-2] text-xs mb-1">Event *</label>
                      <input
                        v-model="recordForm.event"
                        type="text"
                        class="w-full bg-[--deep-blue-tint] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                        placeholder="UFC 305"
                      >
                    </div>

                    <div>
                      <label class="block text-[--cool-grey-2] text-xs mb-1">Date</label>
                      <input
                        v-model="recordForm.date"
                        type="date"
                        class="w-full bg-[--deep-blue-tint] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                      >
                    </div>

                    <div>
                      <label class="block text-[--cool-grey-2] text-xs mb-1">Opponent *</label>
                      <input
                        v-model="recordForm.opponent"
                        type="text"
                        class="w-full bg-[--deep-blue-tint] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                        placeholder="Opponent name"
                      >
                    </div>

                    <div>
                      <label class="block text-[--cool-grey-2] text-xs mb-1">Result *</label>
                      <select
                        v-model="recordForm.result"
                        class="w-full bg-[--deep-blue-tint] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                      >
                        <option>Win</option>
                        <option>Loss</option>
                        <option>Draw</option>
                        <option>No Contest</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-[--cool-grey-2] text-xs mb-1">Method *</label>
                      <input
                        v-model="recordForm.method"
                        type="text"
                        class="w-full bg-[--deep-blue-tint] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                        placeholder="Submission / TKO / Decision..."
                      >
                    </div>

                    <div>
                      <label class="block text-[--cool-grey-2] text-xs mb-1">Round</label>
                      <input
                        v-model.number="recordForm.round"
                        type="number"
                        min="1"
                        max="10"
                        class="w-full bg-[--deep-blue-tint] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                        placeholder="Round #"
                      >
                    </div>
                  </div>

                  <div>
                    <label class="block text-[--cool-grey-2] text-xs mb-1">Notes</label>
                    <input
                      v-model="recordForm.notes"
                      type="text"
                      class="w-full bg-[--deep-blue-tint] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Optional notes"
                    >
                  </div>

                  <button
                    type="button"
                    class="btn-secondary w-full inline-flex items-center justify-center gap-2 py-2"
                    @click="addRecord"
                  >
                    <Icon name="ph:plus" class="w-4 h-4" />
                    Add Result
                  </button>
                </div>

                <!-- Existing records -->
                <div v-if="formData.competition_record.length > 0" class="space-y-2">
                  <div
                    v-for="(record, index) in formData.competition_record"
                    :key="index"
                    class="flex items-center gap-3 bg-[--charcoal-black] rounded-lg px-4 py-3"
                  >
                    <span
                      class="text-xs font-medium px-2 py-0.5 rounded flex-shrink-0"
                      :class="record.result === 'Win' ? 'text-[--hyper-lime] bg-[--hyper-lime]/10' : record.result === 'Loss' ? 'text-red-400 bg-red-400/10' : 'text-[--cool-grey-1] bg-[--cool-grey-1]/10'"
                    >
                      {{ record.result }}
                    </span>
                    <div class="flex-1 min-w-0">
                      <p class="text-[--ice-white] text-sm truncate">
                        vs {{ record.opponent }} — {{ record.method }}
                      </p>
                      <p class="text-[--cool-grey-2] text-xs truncate">
                        {{ record.event }} {{ record.date ? `· ${record.date}` : '' }} {{ record.round ? `· Rd ${record.round}` : '' }}
                      </p>
                    </div>
                    <button
                      type="button"
                      class="text-red-400 hover:text-red-300 flex-shrink-0"
                      @click="removeRecord(index)"
                    >
                      <Icon name="ph:x" class="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p v-else class="text-[--cool-grey-2] text-sm text-center py-2">
                  No results added yet.
                </p>
              </section>

              <!-- Submit error -->
              <div v-if="submitError" class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <Icon name="ph:warning" class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p class="text-red-400 text-sm">{{ submitError }}</p>
              </div>

            </div>

            <!-- Modal footer -->
            <div class="sticky bottom-0 bg-[--deep-blue-tint] border-t border-[--cool-grey-2]/20 p-6 flex gap-4 rounded-b-xl">
              <button
                type="button"
                class="flex-1 btn-secondary"
                :disabled="submitting"
                @click="closeForm"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 btn-primary inline-flex items-center justify-center gap-2"
                :disabled="submitting"
              >
                <div v-if="submitting" class="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
                {{ editingSlug ? 'Save Changes' : 'Create Athlete' }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>
