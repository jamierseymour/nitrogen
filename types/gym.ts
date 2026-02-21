export interface GymLocation {
  lat: number
  lng: number
}

export interface GymContact {
  phone?: string
  email?: string
  website?: string
}

export interface GymSchedule {
  day: string
  times: string
}

export interface GymPricing {
  type: string // e.g., "Monthly", "Drop-in", "Annual"
  price: number
  description?: string
}

export interface GymImage {
  url: string
  alt: string
  caption?: string
}

export interface Gym {
  id: string
  name: string
  address: string
  location: GymLocation
  contact: GymContact
  description: string
  schedule: GymSchedule[]
  pricing: GymPricing[]
  images: GymImage[]
  instructors?: string[]
  amenities?: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateGymInput {
  name: string
  address: string
  location: GymLocation
  contact?: GymContact
  description?: string
  schedule?: GymSchedule[]
  pricing?: GymPricing[]
  images?: GymImage[]
  instructors?: string[]
  amenities?: string[]
}

export interface UpdateGymInput extends Partial<CreateGymInput> {
  id: string
}
