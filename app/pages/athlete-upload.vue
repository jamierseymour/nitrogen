<script setup lang="ts">
import type { Athlete, CompetitionRecord } from '~/types/athlete'

// ─── Weight classes ────────────────────────────────────────────────────────

const WEIGHT_CLASSES = [
  { group: 'BJJ (IBJJF)', options: [
    'Rooster (57.5 kg / 126.8 lbs)',
    'Light Feather (64 kg / 141.1 lbs)',
    'Feather (70 kg / 154.3 lbs)',
    'Light (76 kg / 167.6 lbs)',
    'Middle (82.3 kg / 181.4 lbs)',
    'Medium Heavy (88.3 kg / 194.7 lbs)',
    'Heavy (94.3 kg / 207.9 lbs)',
    'Super Heavy (100.5 kg / 221.6 lbs)',
    'Ultra Heavy (100.5+ kg / 221.6+ lbs)',
  ] },
]

const showWeightDropdown = ref(false)

function toggleWeightClass(value: string) {
  const idx = formData.value.weight_classes.indexOf(value)
  if (idx === -1) {
    formData.value.weight_classes.push(value)
  }
  else {
    formData.value.weight_classes.splice(idx, 1)
  }
}

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

// ─── Image uploads ─────────────────────────────────────────────────────────

const avatarInputRef = ref<HTMLInputElement | null>(null)
const coverInputRef = ref<HTMLInputElement | null>(null)
const uploadingAvatar = ref(false)
const uploadingCover = ref(false)
const uploadError = ref<string | null>(null)

async function uploadImage(file: File, type: 'avatar' | 'cover') {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('type', type)

  const { url } = await $fetch<{ success: boolean, url: string }>('/api/athletes/upload', {
    method: 'POST',
    body: fd,
  })

  return url
}

async function handleAvatarFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingAvatar.value = true
  uploadError.value = null
  try {
    formData.value.avatar_image_url = await uploadImage(file, 'avatar')
  }
  catch {
    uploadError.value = 'Avatar upload failed. Check your Supabase storage bucket.'
  }
  finally {
    uploadingAvatar.value = false
  }
}

async function handleCoverFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingCover.value = true
  uploadError.value = null
  try {
    formData.value.cover_image_url = await uploadImage(file, 'cover')
  }
  catch {
    uploadError.value = 'Cover upload failed. Check your Supabase storage bucket.'
  }
  finally {
    uploadingCover.value = false
  }
}

const blankForm = () => ({
  name: '',
  slug: '',
  sport: 'Brazilian Jiu-Jitsu',
  bio: '',
  avatar_image_url: '',
  cover_image_url: '',
  age: null as number | null,
  nationality: 'South African',
  weight_classes: [] as string[],
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

// ─── CSV Import (Smoothcomp format) ────────────────────────────────────────

const csvInputRef = ref<HTMLInputElement | null>(null)
const csvImportCount = ref(0)

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes
    }
    else if (line[i] === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    }
    else {
      current += line[i]
    }
  }
  result.push(current.trim())
  return result
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n').filter(Boolean)
  if (lines.length < 2) return []
  const headers = parseCSVLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line)
    return Object.fromEntries(headers.map((h, i) => [h.trim(), values[i] ?? '']))
  })
}

function toISODate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return Number.isNaN(d.getTime()) ? dateStr : d.toISOString().split('T')[0]
  }
  catch {
    return dateStr
  }
}

function mapResult(raw: string): CompetitionRecord['result'] {
  const v = (raw || '').toUpperCase().trim()
  if (v === 'WIN') return 'Win'
  if (v === 'LOSS') return 'Loss'
  if (v === 'DRAW') return 'Draw'
  return 'No Contest'
}

function handleCSVImport(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result as string
    const rows = parseCSV(text)
    let added = 0
    for (const row of rows) {
      const opponent = row.name?.trim()
      if (!opponent) continue
      formData.value.competition_record.push({
        event: row.data3?.trim() || '',
        date: toISODate(row.data2?.trim() || ''),
        opponent,
        result: mapResult(row.data4 || ''),
        method: '',
        round: null,
        notes: row.data?.trim() || '',
      })
      added++
    }
    csvImportCount.value = added
    if (csvInputRef.value) csvInputRef.value.value = ''
  }
  reader.readAsText(file)
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
    avatar_image_url: athlete.avatar_image_url || '',
    cover_image_url: athlete.cover_image_url || '',
    age: athlete.age ?? null,
    nationality: athlete.nationality,
    weight_classes: athlete.weight_classes || [],
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
        <Icon name="ph:warning" class="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
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
          <div class="w-16 h-16 rounded-lg overflow-hidden bg-[--charcoal-black] shrink-0">
            <img
              v-if="athlete.avatar_image_url"
              :src="athlete.avatar_image_url"
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
          <div class="flex gap-2 shrink-0">
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
            class="bg-white rounded-xl max-w-3xl w-full"
            @submit.prevent="handleSubmit"
          >

            <!-- Modal header -->
            <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-xl z-10">
              <h2 class="font-heading text-2xl text-gray-900">
                {{ editingSlug ? 'Edit Athlete' : 'Add New Athlete' }}
              </h2>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-700 transition-colors"
                @click="closeForm"
              >
                <Icon name="ph:x" class="w-6 h-6" />
              </button>
            </div>

            <!-- Form body -->
            <div class="p-6 space-y-8">

              <!-- ── Basic Info ── -->
              <section class="space-y-4">
                <h3 class="text-gray-700 font-medium text-lg border-b border-gray-200 pb-2">
                  Basic Information
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-gray-600 text-sm mb-1">Name *</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      required
                      class="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Dricus du Plessis"
                    >
                  </div>

                  <div>
                    <label class="block text-gray-600 text-sm mb-1">Slug *</label>
                    <input
                      v-model="formData.slug"
                      type="text"
                      required
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue] font-mono text-sm"
                      placeholder="dricus-du-plessis"
                    >
                    <p class="text-gray-400 text-xs mt-1">Auto-generated from name. Must be unique.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-gray-600 text-sm mb-1">Sport</label>
                    <div class="w-full bg-gray-100 text-gray-500 border border-gray-200 rounded-lg px-4 py-2 text-sm flex items-center gap-2">
                      <Icon name="ph:medal" class="w-4 h-4 text-blue-500" />
                      Brazilian Jiu-Jitsu
                    </div>
                  </div>

                  <div>
                    <label class="block text-gray-600 text-sm mb-1">Nationality</label>
                    <input
                      v-model="formData.nationality"
                      type="text"
                      class="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="South African"
                    >
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Weight Class multi-select -->
                  <div class="md:col-span-2 relative">
                    <label class="block text-gray-600 text-sm mb-1">Weight Class(es)</label>

                    <!-- Invisible backdrop — closes dropdown on outside click -->
                    <div
                      v-if="showWeightDropdown"
                      class="fixed inset-0 z-10"
                      @click="showWeightDropdown = false"
                    />

                    <!-- Trigger button -->
                    <button
                      type="button"
                      class="w-full min-h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-left flex flex-wrap gap-1 items-center focus:outline-none focus:border-[--electric-blue] hover:border-gray-400 transition-colors relative z-20"
                      @click="showWeightDropdown = !showWeightDropdown"
                    >
                      <template v-if="formData.weight_classes.length">
                        <span
                          v-for="wc in formData.weight_classes"
                          :key="wc"
                          class="inline-flex shrink-0 items-center gap-1 bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full"
                        >
                          {{ wc }}
                          <button
                            type="button"
                            class="cursor-pointer hover:text-red-500 leading-none bg-transparent border-0 p-0 text-inherit"
                            @click.stop="toggleWeightClass(wc)"
                          >×</button>
                        </span>
                      </template>
                      <span v-else class="text-gray-400 text-sm">Select weight class(es)…</span>
                      <Icon name="ph:caret-down" class="ml-auto text-gray-400 w-4 h-4 shrink-0" />
                    </button>

                    <!-- Dropdown panel (z-20, above backdrop) -->
                    <div
                      v-if="showWeightDropdown"
                      class="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto"
                    >
                      <div
                        v-for="group in WEIGHT_CLASSES"
                        :key="group.group"
                      >
                        <div class="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 sticky top-0">
                          {{ group.group }}
                        </div>
                        <button
                          v-for="option in group.options"
                          :key="option"
                          type="button"
                          class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
                          @click="toggleWeightClass(option)"
                        >
                          <span
                            class="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                            :class="formData.weight_classes.includes(option)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'"
                          >
                            <Icon
                              v-if="formData.weight_classes.includes(option)"
                              name="ph:check"
                              class="w-3 h-3 text-white"
                            />
                          </span>
                          <span
                            class="flex-1"
                            :class="formData.weight_classes.includes(option) ? 'text-blue-600 font-medium' : 'text-gray-700'"
                          >
                            {{ option }}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="block text-gray-600 text-sm mb-1">Team / Gym</label>
                    <input
                      v-model="formData.team"
                      type="text"
                      class="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Team name"
                    >
                  </div>

                  <div>
                    <label class="block text-gray-600 text-sm mb-1">Age</label>
                    <input
                      v-model.number="formData.age"
                      type="number"
                      min="1"
                      max="99"
                      class="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="e.g. 28"
                    >
                  </div>
                </div>

                <!-- Upload error -->
                <div v-if="uploadError" class="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                  {{ uploadError }}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Avatar Image -->
                  <div>
                    <label class="block text-gray-600 text-sm mb-1">Avatar Image <span class="text-gray-400">(profile photo)</span></label>

                    <!-- Hidden file input -->
                    <input
                      ref="avatarInputRef"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleAvatarFile"
                    >

                    <!-- Upload area -->
                    <button
                      type="button"
                      class="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[--electric-blue] transition-colors"
                      @click="avatarInputRef?.click()"
                    >
                      <div v-if="uploadingAvatar" class="flex items-center justify-center gap-2 text-gray-500">
                        <div class="h-4 w-4 animate-spin rounded-full border-2 border-solid border-[--electric-blue] border-r-transparent" />
                        <span class="text-sm">Uploading...</span>
                      </div>
                      <div v-else-if="formData.avatar_image_url" class="flex flex-col items-center gap-2">
                        <img :src="formData.avatar_image_url" alt="Avatar" class="w-20 h-20 rounded-lg object-cover">
                        <span class="text-xs text-[--electric-blue]">Click to change</span>
                      </div>
                      <div v-else class="flex flex-col items-center gap-2 py-2 text-gray-400">
                        <Icon name="ph:user-circle" class="w-10 h-10" />
                        <span class="text-sm">Click to upload avatar</span>
                        <span class="text-xs">JPG, PNG, WebP</span>
                      </div>
                    </button>

                    <!-- Manual URL fallback -->
                    <input
                      v-model="formData.avatar_image_url"
                      type="url"
                      class="w-full mt-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Or paste image URL"
                    >
                  </div>

                  <!-- Cover Image -->
                  <div>
                    <label class="block text-gray-600 text-sm mb-1">Cover Image <span class="text-gray-400">(hero banner)</span></label>

                    <!-- Hidden file input -->
                    <input
                      ref="coverInputRef"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleCoverFile"
                    >

                    <!-- Upload area -->
                    <button
                      type="button"
                      class="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[--electric-blue] transition-colors"
                      @click="coverInputRef?.click()"
                    >
                      <div v-if="uploadingCover" class="flex items-center justify-center gap-2 text-gray-500">
                        <div class="h-4 w-4 animate-spin rounded-full border-2 border-solid border-[--electric-blue] border-r-transparent" />
                        <span class="text-sm">Uploading...</span>
                      </div>
                      <div v-else-if="formData.cover_image_url" class="flex flex-col items-center gap-2">
                        <img :src="formData.cover_image_url" alt="Cover" class="w-full h-20 rounded-lg object-cover">
                        <span class="text-xs text-[--electric-blue]">Click to change</span>
                      </div>
                      <div v-else class="flex flex-col items-center gap-2 py-2 text-gray-400">
                        <Icon name="ph:image" class="w-10 h-10" />
                        <span class="text-sm">Click to upload cover</span>
                        <span class="text-xs">JPG, PNG, WebP</span>
                      </div>
                    </button>

                    <!-- Manual URL fallback -->
                    <input
                      v-model="formData.cover_image_url"
                      type="url"
                      class="w-full mt-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Or paste image URL"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-gray-600 text-sm mb-1">Bio</label>
                  <textarea
                    v-model="formData.bio"
                    rows="5"
                    class="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue] resize-y"
                    placeholder="Athlete biography..."
                  />
                </div>
              </section>

              <!-- ── Social Links ── -->
              <section class="space-y-4">
                <h3 class="text-gray-700 font-medium text-lg border-b border-gray-200 pb-2">
                  Social Links
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="flex items-center gap-2 text-gray-600 text-sm mb-1">
                      <Icon name="ph:instagram-logo" class="w-4 h-4" /> Instagram
                    </label>
                    <input
                      v-model="formData.social_links.instagram"
                      type="url"
                      class="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="https://instagram.com/..."
                    >
                  </div>

                  <div>
                    <label class="flex items-center gap-2 text-gray-600 text-sm mb-1">
                      <Icon name="ph:x-logo" class="w-4 h-4" /> X / Twitter
                    </label>
                    <input
                      v-model="formData.social_links.twitter"
                      type="url"
                      class="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="https://x.com/..."
                    >
                  </div>

                  <div>
                    <label class="flex items-center gap-2 text-gray-600 text-sm mb-1">
                      <Icon name="ph:youtube-logo" class="w-4 h-4" /> YouTube
                    </label>
                    <input
                      v-model="formData.social_links.youtube"
                      type="url"
                      class="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="https://youtube.com/@..."
                    >
                  </div>

                  <div>
                    <label class="flex items-center gap-2 text-gray-600 text-sm mb-1">
                      <Icon name="ph:globe" class="w-4 h-4" /> Website
                    </label>
                    <input
                      v-model="formData.social_links.website"
                      type="url"
                      class="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="https://..."
                    >
                  </div>
                </div>
              </section>

              <!-- ── Competition Record ── -->
              <section class="space-y-4">
                <div class="flex items-center gap-3 border-b border-gray-200 pb-2">
                  <h3 class="text-gray-700 font-medium text-lg flex-1">
                    Competition Record
                  </h3>
                  <!-- CSV import -->
                  <input
                    ref="csvInputRef"
                    type="file"
                    accept=".csv"
                    class="hidden"
                    @change="handleCSVImport"
                  >
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg"
                    @click="csvInputRef?.click()"
                  >
                    <Icon name="ph:upload-simple" class="w-3.5 h-3.5" />
                    Import CSV
                  </button>
                </div>

                <!-- CSV import success notice -->
                <div
                  v-if="csvImportCount > 0"
                  class="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm text-green-700"
                >
                  <Icon name="ph:check-circle" class="w-4 h-4 shrink-0" />
                  {{ csvImportCount }} result{{ csvImportCount === 1 ? '' : 's' }} imported from CSV. Review below — you can remove any incorrect entries.
                </div>

                <!-- Add record form -->
                <div class="bg-gray-100 rounded-lg p-4 space-y-3">
                  <p class="text-gray-700 text-sm font-medium">Add a Result Manually</p>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-gray-500 text-xs mb-1">Event *</label>
                      <input
                        v-model="recordForm.event"
                        type="text"
                        class="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                        placeholder="UFC 305"
                      >
                    </div>

                    <div>
                      <label class="block text-gray-500 text-xs mb-1">Date</label>
                      <input
                        v-model="recordForm.date"
                        type="date"
                        class="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                      >
                    </div>

                    <div>
                      <label class="block text-gray-500 text-xs mb-1">Opponent *</label>
                      <input
                        v-model="recordForm.opponent"
                        type="text"
                        class="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                        placeholder="Opponent name"
                      >
                    </div>

                    <div>
                      <label class="block text-gray-500 text-xs mb-1">Result *</label>
                      <select
                        v-model="recordForm.result"
                        class="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                      >
                        <option>Win</option>
                        <option>Loss</option>
                        <option>Draw</option>
                        <option>No Contest</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-gray-500 text-xs mb-1">Method *</label>
                      <input
                        v-model="recordForm.method"
                        type="text"
                        class="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                        placeholder="Submission / TKO / Decision..."
                      >
                    </div>

                    <div>
                      <label class="block text-gray-500 text-xs mb-1">Round</label>
                      <input
                        v-model.number="recordForm.round"
                        type="number"
                        min="1"
                        max="10"
                        class="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
                        placeholder="Round #"
                      >
                    </div>
                  </div>

                  <div>
                    <label class="block text-[--cool-grey-2] text-xs mb-1">Notes</label>
                    <input
                      v-model="recordForm.notes"
                      type="text"
                      class="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--electric-blue]"
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
                    class="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3"
                  >
                    <span
                      class="text-xs font-medium px-2 py-0.5 rounded shrink-0"
                      :class="record.result === 'Win' ? 'text-[--hyper-lime] bg-[--hyper-lime]/10' : record.result === 'Loss' ? 'text-red-400 bg-red-400/10' : 'text-[--cool-grey-1] bg-[--cool-grey-1]/10'"
                    >
                      {{ record.result }}
                    </span>
                    <div class="flex-1 min-w-0">
                      <p class="text-gray-800 text-sm truncate">
                        vs {{ record.opponent }} — {{ record.method }}
                      </p>
                      <p class="text-gray-500 text-xs truncate">
                        {{ record.event }} {{ record.date ? `· ${record.date}` : '' }} {{ record.round ? `· Rd ${record.round}` : '' }}
                      </p>
                    </div>
                    <button
                      type="button"
                      class="text-red-400 hover:text-red-300 shrink-0"
                      @click="removeRecord(index)"
                    >
                      <Icon name="ph:x" class="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p v-else class="text-gray-400 text-sm text-center py-2">
                  No results added yet.
                </p>
              </section>

              <!-- Submit error -->
              <div v-if="submitError" class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <Icon name="ph:warning" class="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p class="text-red-400 text-sm">{{ submitError }}</p>
              </div>

            </div>

            <!-- Modal footer -->
            <div class="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-4 rounded-b-xl">
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
