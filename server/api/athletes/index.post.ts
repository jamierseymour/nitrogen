import type { Athlete } from '~/types/athlete'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.name || !body.slug || !body.sport) {
    throw createError({
      statusCode: 400,
      statusMessage: 'name, slug, and sport are required',
    })
  }

  const supabase = useSupabase()

  const { data, error } = await supabase
    .from('athletes')
    .insert({
      name: body.name,
      slug: body.slug,
      sport: body.sport,
      bio: body.bio || null,
      image_url: body.image_url || null,
      competition_record: body.competition_record || [],
      nationality: body.nationality || 'South African',
      weight_class: body.weight_class || null,
      team: body.team || null,
      social_links: body.social_links || {},
    })
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return {
    success: true,
    data: data as Athlete,
  }
})
