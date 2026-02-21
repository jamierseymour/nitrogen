import type { UpdateGymInput } from '~/types/gym'
import { updateGym } from '../../db/gyms'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<UpdateGymInput>(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Gym ID is required',
    })
  }

  const updatedGym = updateGym(id, body)

  if (!updatedGym) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Gym not found',
    })
  }

  return {
    success: true,
    data: updatedGym,
  }
})
