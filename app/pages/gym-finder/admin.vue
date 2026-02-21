<script setup lang="ts">
import type { Gym, CreateGymInput, GymSchedule, GymPricing, GymImage } from '~/types/gym'

definePageMeta({
  layout: 'default',
})

const gymsStore = useGymsStore()

// Form state
const showForm = ref(false)
const editingGym = ref<Gym | null>(null)
const formData = ref<CreateGymInput>({
  name: '',
  address: '',
  location: { lat: 0, lng: 0 },
  contact: {
    phone: '',
    email: '',
    website: '',
  },
  description: '',
  schedule: [],
  pricing: [],
  images: [],
  instructors: [],
  amenities: [],
})

// Schedule form
const scheduleForm = ref({ day: '', times: '' })
const addSchedule = () => {
  if (scheduleForm.value.day && scheduleForm.value.times) {
    formData.value.schedule = formData.value.schedule || []
    formData.value.schedule.push({ ...scheduleForm.value })
    scheduleForm.value = { day: '', times: '' }
  }
}
const removeSchedule = (index: number) => {
  formData.value.schedule?.splice(index, 1)
}

// Pricing form
const pricingForm = ref({ type: '', price: 0, description: '' })
const addPricing = () => {
  if (pricingForm.value.type && pricingForm.value.price > 0) {
    formData.value.pricing = formData.value.pricing || []
    formData.value.pricing.push({ ...pricingForm.value })
    pricingForm.value = { type: '', price: 0, description: '' }
  }
}
const removePricing = (index: number) => {
  formData.value.pricing?.splice(index, 1)
}

// Image form
const imageForm = ref({ url: '', alt: '', caption: '' })
const addImage = () => {
  if (imageForm.value.url && imageForm.value.alt) {
    formData.value.images = formData.value.images || []
    formData.value.images.push({ ...imageForm.value })
    imageForm.value = { url: '', alt: '', caption: '' }
  }
}
const removeImage = (index: number) => {
  formData.value.images?.splice(index, 1)
}

// Instructors
const instructorInput = ref('')
const addInstructor = () => {
  if (instructorInput.value.trim()) {
    formData.value.instructors = formData.value.instructors || []
    formData.value.instructors.push(instructorInput.value.trim())
    instructorInput.value = ''
  }
}
const removeInstructor = (index: number) => {
  formData.value.instructors?.splice(index, 1)
}

// Amenities
const amenityInput = ref('')
const addAmenity = () => {
  if (amenityInput.value.trim()) {
    formData.value.amenities = formData.value.amenities || []
    formData.value.amenities.push(amenityInput.value.trim())
    amenityInput.value = ''
  }
}
const removeAmenity = (index: number) => {
  formData.value.amenities?.splice(index, 1)
}

// Load gyms
onMounted(async () => {
  await gymsStore.fetchGyms()
})

const openCreateForm = () => {
  editingGym.value = null
  formData.value = {
    name: '',
    address: '',
    location: { lat: 0, lng: 0 },
    contact: { phone: '', email: '', website: '' },
    description: '',
    schedule: [],
    pricing: [],
    images: [],
    instructors: [],
    amenities: [],
  }
  showForm.value = true
}

const openEditForm = (gym: Gym) => {
  editingGym.value = gym
  formData.value = {
    name: gym.name,
    address: gym.address,
    location: { ...gym.location },
    contact: { ...gym.contact },
    description: gym.description,
    schedule: [...(gym.schedule || [])],
    pricing: [...(gym.pricing || [])],
    images: [...(gym.images || [])],
    instructors: [...(gym.instructors || [])],
    amenities: [...(gym.amenities || [])],
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingGym.value = null
}

const handleSubmit = async () => {
  try {
    if (editingGym.value) {
      await gymsStore.updateGym({
        id: editingGym.value.id,
        ...formData.value,
      })
    }
    else {
      await gymsStore.createGym(formData.value)
    }
    closeForm()
  }
  catch (error) {
    console.error('Error saving gym:', error)
  }
}

const handleDelete = async (gym: Gym) => {
  if (confirm(`Are you sure you want to delete "${gym.name}"?`)) {
    try {
      await gymsStore.deleteGym(gym.id)
    }
    catch (error) {
      console.error('Error deleting gym:', error)
    }
  }
}

useSeoMeta({
  title: 'Gym Admin - Manage Jiu Jitsu Gyms',
  description: 'Add, edit, and manage Brazilian Jiu Jitsu gym listings.',
})
</script>

<template>
  <div class="min-h-screen bg-[--deep-navy]">
    <div class="container mx-auto px-4 py-8 md:py-12">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink
          to="/gym-finder"
          class="inline-flex items-center gap-2 text-[--electric-blue] hover:text-[--hyper-lime] transition-colors mb-4"
        >
          <Icon name="ph:arrow-left" class="w-5 h-5" />
          <span>Back to Gym Finder</span>
        </NuxtLink>

        <div class="flex justify-between items-center">
          <h1 class="font-heading text-4xl md:text-5xl text-[--ice-white]">
            Gym Admin
          </h1>
          <button @click="openCreateForm" class="btn-primary">
            <Icon name="ph:plus" class="w-5 h-5 mr-2" />
            Add Gym
          </button>
        </div>
      </div>

      <!-- Gyms List -->
      <div class="space-y-4">
        <div
          v-for="gym in gymsStore.gyms"
          :key="gym.id"
          class="bg-[--deep-blue-tint] rounded-lg p-6 flex items-start justify-between gap-4"
        >
          <div class="flex-1">
            <h3 class="font-heading text-2xl text-[--ice-white] mb-2">
              {{ gym.name }}
            </h3>
            <p class="text-[--cool-grey-2] mb-3">{{ gym.address }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-if="gym.images?.length" class="text-xs bg-[--charcoal-black] text-[--cool-grey-1] px-2 py-1 rounded">
                {{ gym.images.length }} images
              </span>
              <span v-if="gym.schedule?.length" class="text-xs bg-[--charcoal-black] text-[--cool-grey-1] px-2 py-1 rounded">
                {{ gym.schedule.length }} schedule items
              </span>
              <span v-if="gym.pricing?.length" class="text-xs bg-[--charcoal-black] text-[--cool-grey-1] px-2 py-1 rounded">
                {{ gym.pricing.length }} pricing options
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="openEditForm(gym)"
              class="btn-secondary py-2 px-4"
            >
              <Icon name="ph:pencil" class="w-5 h-5" />
            </button>
            <button
              @click="handleDelete(gym)"
              class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <Icon name="ph:trash" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!gymsStore.hasGyms" class="text-center py-12">
          <Icon name="ph:map-pin-plus" class="w-16 h-16 text-[--cool-grey-2] mx-auto mb-4" />
          <p class="text-[--cool-grey-2] mb-4">No gyms added yet</p>
          <button @click="openCreateForm" class="btn-primary">
            Add Your First Gym
          </button>
        </div>
      </div>

      <!-- Form Modal -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showForm"
          class="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
          @click.self="closeForm"
        >
          <div class="min-h-screen flex items-start justify-center p-4 py-8">
            <form
              @submit.prevent="handleSubmit"
              class="bg-[--deep-blue-tint] rounded-xl max-w-3xl w-full"
            >
              <!-- Header -->
              <div class="sticky top-0 bg-[--deep-blue-tint] border-b border-[--cool-grey-2]/20 p-6 flex justify-between items-center rounded-t-xl">
                <h2 class="font-heading text-2xl text-[--ice-white]">
                  {{ editingGym ? 'Edit Gym' : 'Add New Gym' }}
                </h2>
                <button
                  type="button"
                  @click="closeForm"
                  class="text-[--cool-grey-2] hover:text-[--ice-white] transition-colors"
                >
                  <Icon name="ph:x" class="w-6 h-6" />
                </button>
              </div>

              <!-- Form Content -->
              <div class="p-6 space-y-6">
                <!-- Basic Info -->
                <div class="space-y-4">
                  <h3 class="text-[--cool-grey-1] font-medium text-lg">Basic Information</h3>

                  <div>
                    <label class="block text-[--cool-grey-1] text-sm mb-2">Gym Name *</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      required
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Enter gym name"
                    >
                  </div>

                  <div>
                    <label class="block text-[--cool-grey-1] text-sm mb-2">Address *</label>
                    <input
                      v-model="formData.address"
                      type="text"
                      required
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Enter full address"
                    >
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[--cool-grey-1] text-sm mb-2">Latitude *</label>
                      <input
                        v-model.number="formData.location.lat"
                        type="number"
                        step="any"
                        required
                        class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                        placeholder="e.g., 40.7128"
                      >
                    </div>
                    <div>
                      <label class="block text-[--cool-grey-1] text-sm mb-2">Longitude *</label>
                      <input
                        v-model.number="formData.location.lng"
                        type="number"
                        step="any"
                        required
                        class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                        placeholder="e.g., -74.0060"
                      >
                    </div>
                  </div>
                  <p class="text-[--cool-grey-2] text-xs">
                    Tip: Use <a href="https://www.latlong.net/" target="_blank" class="text-[--electric-blue] hover:underline">latlong.net</a> to find coordinates
                  </p>

                  <div>
                    <label class="block text-[--cool-grey-1] text-sm mb-2">Description</label>
                    <textarea
                      v-model="formData.description"
                      rows="4"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Tell us about this gym..."
                    />
                  </div>
                </div>

                <!-- Contact Info -->
                <div class="space-y-4">
                  <h3 class="text-[--cool-grey-1] font-medium text-lg">Contact Information</h3>

                  <div>
                    <label class="block text-[--cool-grey-1] text-sm mb-2">Phone</label>
                    <input
                      v-model="formData.contact!.phone"
                      type="tel"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="(555) 123-4567"
                    >
                  </div>

                  <div>
                    <label class="block text-[--cool-grey-1] text-sm mb-2">Email</label>
                    <input
                      v-model="formData.contact!.email"
                      type="email"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="contact@gym.com"
                    >
                  </div>

                  <div>
                    <label class="block text-[--cool-grey-1] text-sm mb-2">Website</label>
                    <input
                      v-model="formData.contact!.website"
                      type="url"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="https://www.gym.com"
                    >
                  </div>
                </div>

                <!-- Schedule -->
                <div class="space-y-4">
                  <h3 class="text-[--cool-grey-1] font-medium text-lg">Schedule</h3>

                  <div class="flex gap-2">
                    <input
                      v-model="scheduleForm.day"
                      type="text"
                      class="flex-1 bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Day (e.g., Monday)"
                    >
                    <input
                      v-model="scheduleForm.times"
                      type="text"
                      class="flex-1 bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Times (e.g., 6:00 AM - 8:00 PM)"
                    >
                    <button
                      type="button"
                      @click="addSchedule"
                      class="btn-secondary px-4"
                    >
                      <Icon name="ph:plus" class="w-5 h-5" />
                    </button>
                  </div>

                  <div v-if="formData.schedule && formData.schedule.length > 0" class="space-y-2">
                    <div
                      v-for="(schedule, index) in formData.schedule"
                      :key="index"
                      class="flex justify-between items-center bg-[--charcoal-black] rounded-lg px-4 py-2"
                    >
                      <span class="text-[--ice-white]">{{ schedule.day }}: {{ schedule.times }}</span>
                      <button
                        type="button"
                        @click="removeSchedule(index)"
                        class="text-red-400 hover:text-red-300"
                      >
                        <Icon name="ph:x" class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Pricing -->
                <div class="space-y-4">
                  <h3 class="text-[--cool-grey-1] font-medium text-lg">Pricing</h3>

                  <div class="space-y-2">
                    <div class="flex gap-2">
                      <input
                        v-model="pricingForm.type"
                        type="text"
                        class="flex-1 bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                        placeholder="Type (e.g., Monthly)"
                      >
                      <input
                        v-model.number="pricingForm.price"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-32 bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                        placeholder="Price"
                      >
                      <button
                        type="button"
                        @click="addPricing"
                        class="btn-secondary px-4"
                      >
                        <Icon name="ph:plus" class="w-5 h-5" />
                      </button>
                    </div>
                    <input
                      v-model="pricingForm.description"
                      type="text"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Description (optional)"
                    >
                  </div>

                  <div v-if="formData.pricing && formData.pricing.length > 0" class="space-y-2">
                    <div
                      v-for="(price, index) in formData.pricing"
                      :key="index"
                      class="flex justify-between items-center bg-[--charcoal-black] rounded-lg px-4 py-2"
                    >
                      <div>
                        <span class="text-[--ice-white]">{{ price.type }}: ${{ price.price }}</span>
                        <p v-if="price.description" class="text-[--cool-grey-2] text-sm">{{ price.description }}</p>
                      </div>
                      <button
                        type="button"
                        @click="removePricing(index)"
                        class="text-red-400 hover:text-red-300"
                      >
                        <Icon name="ph:x" class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Images -->
                <div class="space-y-4">
                  <h3 class="text-[--cool-grey-1] font-medium text-lg">Images</h3>

                  <div class="space-y-2">
                    <input
                      v-model="imageForm.url"
                      type="url"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Image URL"
                    >
                    <input
                      v-model="imageForm.alt"
                      type="text"
                      class="w-full bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Alt text"
                    >
                    <div class="flex gap-2">
                      <input
                        v-model="imageForm.caption"
                        type="text"
                        class="flex-1 bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                        placeholder="Caption (optional)"
                      >
                      <button
                        type="button"
                        @click="addImage"
                        class="btn-secondary px-4"
                      >
                        <Icon name="ph:plus" class="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div v-if="formData.images && formData.images.length > 0" class="grid grid-cols-2 gap-2">
                    <div
                      v-for="(image, index) in formData.images"
                      :key="index"
                      class="relative group"
                    >
                      <img
                        :src="image.url"
                        :alt="image.alt"
                        class="w-full h-32 object-cover rounded-lg"
                      >
                      <button
                        type="button"
                        @click="removeImage(index)"
                        class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="ph:x" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Instructors -->
                <div class="space-y-4">
                  <h3 class="text-[--cool-grey-1] font-medium text-lg">Instructors</h3>

                  <div class="flex gap-2">
                    <input
                      v-model="instructorInput"
                      type="text"
                      class="flex-1 bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Instructor name"
                      @keyup.enter="addInstructor"
                    >
                    <button
                      type="button"
                      @click="addInstructor"
                      class="btn-secondary px-4"
                    >
                      <Icon name="ph:plus" class="w-5 h-5" />
                    </button>
                  </div>

                  <div v-if="formData.instructors && formData.instructors.length > 0" class="flex flex-wrap gap-2">
                    <div
                      v-for="(instructor, index) in formData.instructors"
                      :key="index"
                      class="bg-[--charcoal-black] text-[--ice-white] rounded-lg px-3 py-1 flex items-center gap-2"
                    >
                      <span>{{ instructor }}</span>
                      <button
                        type="button"
                        @click="removeInstructor(index)"
                        class="text-red-400 hover:text-red-300"
                      >
                        <Icon name="ph:x" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Amenities -->
                <div class="space-y-4">
                  <h3 class="text-[--cool-grey-1] font-medium text-lg">Amenities</h3>

                  <div class="flex gap-2">
                    <input
                      v-model="amenityInput"
                      type="text"
                      class="flex-1 bg-[--charcoal-black] text-[--ice-white] border border-[--cool-grey-2]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[--electric-blue]"
                      placeholder="Amenity (e.g., Showers, Parking)"
                      @keyup.enter="addAmenity"
                    >
                    <button
                      type="button"
                      @click="addAmenity"
                      class="btn-secondary px-4"
                    >
                      <Icon name="ph:plus" class="w-5 h-5" />
                    </button>
                  </div>

                  <div v-if="formData.amenities && formData.amenities.length > 0" class="flex flex-wrap gap-2">
                    <div
                      v-for="(amenity, index) in formData.amenities"
                      :key="index"
                      class="bg-[--charcoal-black] text-[--ice-white] rounded-lg px-3 py-1 flex items-center gap-2"
                    >
                      <span>{{ amenity }}</span>
                      <button
                        type="button"
                        @click="removeAmenity(index)"
                        class="text-red-400 hover:text-red-300"
                      >
                        <Icon name="ph:x" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="sticky bottom-0 bg-[--deep-blue-tint] border-t border-[--cool-grey-2]/20 p-6 flex gap-4 rounded-b-xl">
                <button
                  type="button"
                  @click="closeForm"
                  class="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="flex-1 btn-primary"
                >
                  {{ editingGym ? 'Update Gym' : 'Create Gym' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
