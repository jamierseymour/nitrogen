import type { Athlete } from '~/types/athlete'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Athlete slug is required',
    })
  }

  const body = await readBody(event)
  const supabase = useSupabase()

  const { data, error } = await supabase
    .from('athletes')
    .update({
      name: body.name,
      slug: body.slug,
      sport: body.sport,
      bio: body.bio || null,
      avatar_image_url: body.avatar_image_url || null,
      cover_image_url: body.cover_image_url || null,
      age: body.age || null,
      competition_record: body.competition_record || [],
      nationality: body.nationality || 'South African',
      weight_classes: body.weight_classes || [],
      team: body.team || null,
      social_links: body.social_links || {},
    })
    .eq('slug', slug)
    .select()
    .single()

  if (error || !data) {
    throw createError({
      statusCode: error ? 500 : 404,
      statusMessage: error?.message || 'Athlete not found',
    })
  }

  return {
    success: true,
    data: data as Athlete,
  }
})
