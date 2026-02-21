import type { Gym } from '~/types/gym'

// In-memory database for gyms
// In production, replace this with a real database connection
// This array will reset when the server restarts
export const gymsDatabase: Gym[] = []

// Helper function to get all gyms
export function getAllGyms(): Gym[] {
  return gymsDatabase
}

// Helper function to get a gym by ID
export function getGymById(id: string): Gym | undefined {
  return gymsDatabase.find(g => g.id === id)
}

// Helper function to add a gym
export function addGym(gym: Gym): Gym {
  gymsDatabase.push(gym)
  return gym
}

// Helper function to update a gym
export function updateGym(id: string, updates: Partial<Gym>): Gym | null {
  const index = gymsDatabase.findIndex(g => g.id === id)
  if (index === -1) return null

  gymsDatabase[index] = {
    ...gymsDatabase[index],
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
  }

  return gymsDatabase[index]
}

// Helper function to delete a gym
export function deleteGym(id: string): Gym | null {
  const index = gymsDatabase.findIndex(g => g.id === id)
  if (index === -1) return null

  return gymsDatabase.splice(index, 1)[0]
}
