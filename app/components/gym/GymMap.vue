<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import type { Gym } from '~/types/gym'

const props = defineProps<{
  gyms: Gym[]
  center?: { lat: number, lng: number }
  zoom?: number
}>()

const emit = defineEmits<{
  gymClick: [gym: Gym]
}>()

const config = useRuntimeConfig()
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<google.maps.Map | null>(null)
const markers = ref<google.maps.marker.AdvancedMarkerElement[]>([])

// Default center (US center) if not provided
const defaultCenter = { lat: 39.8283, lng: -98.5795 }

const initMap = async () => {
  if (!mapContainer.value) return

  const apiKey = config.public.googleMapsApiKey

  if (!apiKey) {
    console.error('Google Maps API key is not configured. Please add NUXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file')
    return
  }

  try {
    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['marker'],
    })

    await loader.load()

    // Create map
    map.value = new google.maps.Map(mapContainer.value, {
      center: props.center || defaultCenter,
      zoom: props.zoom || 5,
      mapId: 'GYM_FINDER_MAP',
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    })

    // Add markers for all gyms
    updateMarkers()
  }
  catch (error) {
    console.error('Error loading Google Maps:', error)
  }
}

const updateMarkers = async () => {
  if (!map.value) return

  // Clear existing markers
  markers.value.forEach(marker => {
    marker.map = null
  })
  markers.value = []

  // Create new markers
  for (const gym of props.gyms) {
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary

    // Create custom pin
    const pin = new PinElement({
      background: '#1B8CFF', // electric-blue from your theme
      borderColor: '#C6FF1E', // hyper-lime from your theme
      glyphColor: '#FFFFFF',
      scale: 1.2,
    })

    const marker = new AdvancedMarkerElement({
      map: map.value,
      position: gym.location,
      title: gym.name,
      content: pin.element,
    })

    // Add click listener
    marker.addListener('click', () => {
      emit('gymClick', gym)
    })

    markers.value.push(marker)
  }

  // Fit bounds to show all markers
  if (props.gyms.length > 0) {
    const bounds = new google.maps.LatLngBounds()
    props.gyms.forEach(gym => {
      bounds.extend(gym.location)
    })
    map.value.fitBounds(bounds)

    // Adjust zoom if only one gym
    if (props.gyms.length === 1) {
      map.value.setZoom(15)
    }
  }
}

// Watch for changes in gyms prop
watch(() => props.gyms, () => {
  updateMarkers()
}, { deep: true })

// Initialize map on mount
onMounted(() => {
  initMap()
})

// Cleanup on unmount
onUnmounted(() => {
  markers.value.forEach(marker => {
    marker.map = null
  })
})
</script>

<template>
  <div ref="mapContainer" class="w-full h-full min-h-[400px] rounded-lg" />
</template>
