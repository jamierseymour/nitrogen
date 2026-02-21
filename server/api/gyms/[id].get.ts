import { getGymById } from '../../db/gyms'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Gym ID is required',
    })
  }

  const gym = getGymById(id)

  if (!gym) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Gym not found',
    })
  }

  return {
    success: true,
    data: gym,
  }
})
