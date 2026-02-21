import type { Gym, CreateGymInput } from '~/types/gym'
import { addGym } from '../../db/gyms'

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateGymInput>(event)

  // Validation
  if (!body.name || !body.address || !body.location) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name, address, and location are required',
    })
  }

  const newGym: Gym = {
    id: crypto.randomUUID(),
    name: body.name,
    address: body.address,
    location: body.location,
    contact: body.contact || {},
    description: body.description || '',
    schedule: body.schedule || [],
    pricing: body.pricing || [],
    images: body.images || [],
    instructors: body.instructors || [],
    amenities: body.amenities || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  addGym(newGym)

  return {
    success: true,
    data: newGym,
  }
})
