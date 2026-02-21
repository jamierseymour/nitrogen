import { getAllGyms } from '../../db/gyms'

export default defineEventHandler(async (event) => {
  const gyms = getAllGyms()

  return {
    success: true,
    data: gyms,
  }
})
