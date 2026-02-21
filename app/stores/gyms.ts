import { defineStore } from 'pinia'
import type { Gym, CreateGymInput, UpdateGymInput } from '~/types/gym'

interface GymsState {
  gyms: Gym[]
  selectedGym: Gym | null
  loading: boolean
  error: string | null
}

export const useGymsStore = defineStore('gyms', {
  state: (): GymsState => ({
    gyms: [],
    selectedGym: null,
    loading: false,
    error: null,
  }),

  getters: {
    getGymById: (state) => {
      return (id: string) => state.gyms.find(gym => gym.id === id)
    },

    hasGyms: (state) => state.gyms.length > 0,
  },

  actions: {
    async fetchGyms() {
      this.loading = true
      this.error = null

      try {
        const { data } = await $fetch<{ success: boolean, data: Gym[] }>('/api/gyms')
        this.gyms = data
      }
      catch (error) {
        this.error = 'Failed to fetch gyms'
        console.error('Error fetching gyms:', error)
      }
      finally {
        this.loading = false
      }
    },

    async fetchGymById(id: string) {
      this.loading = true
      this.error = null

      try {
        const { data } = await $fetch<{ success: boolean, data: Gym }>(`/api/gyms/${id}`)
        this.selectedGym = data

        // Update in local array if exists
        const index = this.gyms.findIndex(g => g.id === id)
        if (index !== -1) {
          this.gyms[index] = data
        }
        else {
          this.gyms.push(data)
        }

        return data
      }
      catch (error) {
        this.error = 'Failed to fetch gym'
        console.error('Error fetching gym:', error)
        throw error
      }
      finally {
        this.loading = false
      }
    },

    async createGym(input: CreateGymInput) {
      this.loading = true
      this.error = null

      try {
        const { data } = await $fetch<{ success: boolean, data: Gym }>('/api/gyms', {
          method: 'POST',
          body: input,
        })

        this.gyms.push(data)
        return data
      }
      catch (error) {
        this.error = 'Failed to create gym'
        console.error('Error creating gym:', error)
        throw error
      }
      finally {
        this.loading = false
      }
    },

    async updateGym(input: UpdateGymInput) {
      this.loading = true
      this.error = null

      try {
        const { data } = await $fetch<{ success: boolean, data: Gym }>(`/api/gyms/${input.id}`, {
          method: 'PUT',
          body: input,
        })

        // Update in local array
        const index = this.gyms.findIndex(g => g.id === input.id)
        if (index !== -1) {
          this.gyms[index] = data
        }

        // Update selected gym if it's the same one
        if (this.selectedGym?.id === input.id) {
          this.selectedGym = data
        }

        return data
      }
      catch (error) {
        this.error = 'Failed to update gym'
        console.error('Error updating gym:', error)
        throw error
      }
      finally {
        this.loading = false
      }
    },

    async deleteGym(id: string) {
      this.loading = true
      this.error = null

      try {
        await $fetch(`/api/gyms/${id}`, {
          method: 'DELETE',
        })

        // Remove from local array
        this.gyms = this.gyms.filter(g => g.id !== id)

        // Clear selected gym if it was deleted
        if (this.selectedGym?.id === id) {
          this.selectedGym = null
        }
      }
      catch (error) {
        this.error = 'Failed to delete gym'
        console.error('Error deleting gym:', error)
        throw error
      }
      finally {
        this.loading = false
      }
    },

    selectGym(gym: Gym | null) {
      this.selectedGym = gym
    },

    clearError() {
      this.error = null
    },
  },
})
