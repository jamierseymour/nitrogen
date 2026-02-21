import type { Athlete } from '~/types/athlete'

export default defineEventHandler(async () => {
  const supabase = useSupabase()

  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return {
    success: true,
    data: data as Athlete[],
  }
})
