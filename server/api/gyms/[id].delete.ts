import { deleteGym } from '../../db/gyms'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Gym ID is required',
    })
  }

  const deletedGym = deleteGym(id)

  if (!deletedGym) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Gym not found',
    })
  }

  return {
    success: true,
    data: deletedGym,
  }
})
