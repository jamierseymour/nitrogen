export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Athlete slug is required',
    })
  }

  const supabase = useSupabase()

  const { error } = await supabase
    .from('athletes')
    .delete()
    .eq('slug', slug)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return {
    success: true,
  }
})
