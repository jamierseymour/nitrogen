import { defineStore } from 'pinia'
import type { Athlete } from '~/types/athlete'

interface AthletesState {
  athletes: Athlete[]
  selectedAthlete: Athlete | null
  loading: boolean
  error: string | null
}

export const useAthletesStore = defineStore('athletes', {
  state: (): AthletesState => ({
    athletes: [],
    selectedAthlete: null,
    loading: false,
    error: null,
  }),

  getters: {
    getAthleteBySlug: (state) => {
      return (slug: string) => state.athletes.find(a => a.slug === slug)
    },
    hasAthletes: (state) => state.athletes.length > 0,
  },

  actions: {
    async fetchAthletes() {
      this.loading = true
      this.error = null

      try {
        const { data } = await $fetch<{ success: boolean, data: Athlete[] }>('/api/athletes')
        this.athletes = data
      }
      catch (error) {
        this.error = 'Failed to fetch athletes'
        console.error('Error fetching athletes:', error)
      }
      finally {
        this.loading = false
      }
    },

    async fetchAthleteBySlug(slug: string) {
      this.loading = true
      this.error = null

      try {
        const { data } = await $fetch<{ success: boolean, data: Athlete }>(`/api/athletes/${slug}`)
        this.selectedAthlete = data

        const index = this.athletes.findIndex(a => a.slug === slug)
        if (index !== -1) {
          this.athletes[index] = data
        }
        else {
          this.athletes.push(data)
        }

        return data
      }
      catch (error) {
        this.error = 'Failed to fetch athlete'
        console.error('Error fetching athlete:', error)
        throw error
      }
      finally {
        this.loading = false
      }
    },

    async createAthlete(input: Omit<Athlete, 'id' | 'created_at' | 'updated_at'>) {
      this.loading = true
      this.error = null

      try {
        const { data } = await $fetch<{ success: boolean, data: Athlete }>('/api/athletes', {
          method: 'POST',
          body: input,
        })
        this.athletes.push(data)
        return data
      }
      catch (error) {
        this.error = 'Failed to create athlete'
        console.error('Error creating athlete:', error)
        throw error
      }
      finally {
        this.loading = false
      }
    },

    async updateAthlete(slug: string, input: Omit<Athlete, 'id' | 'created_at' | 'updated_at'>) {
      this.loading = true
      this.error = null

      try {
        const { data } = await $fetch<{ success: boolean, data: Athlete }>(`/api/athletes/${slug}`, {
          method: 'PUT',
          body: input,
        })

        const index = this.athletes.findIndex(a => a.slug === slug)
        if (index !== -1) {
          this.athletes[index] = data
        }

        if (this.selectedAthlete?.slug === slug) {
          this.selectedAthlete = data
        }

        return data
      }
      catch (error) {
        this.error = 'Failed to update athlete'
        console.error('Error updating athlete:', error)
        throw error
      }
      finally {
        this.loading = false
      }
    },

    async deleteAthlete(slug: string) {
      this.loading = true
      this.error = null

      try {
        await $fetch(`/api/athletes/${slug}`, { method: 'DELETE' })
        this.athletes = this.athletes.filter(a => a.slug !== slug)

        if (this.selectedAthlete?.slug === slug) {
          this.selectedAthlete = null
        }
      }
      catch (error) {
        this.error = 'Failed to delete athlete'
        console.error('Error deleting athlete:', error)
        throw error
      }
      finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },
  },
})
