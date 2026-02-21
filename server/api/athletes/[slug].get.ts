import type { Athlete } from '~/types/athlete'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Athlete slug is required',
    })
  }

  const supabase = useSupabase()

  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Athlete not found',
    })
  }

  return {
    success: true,
    data: data as Athlete,
  }
})
