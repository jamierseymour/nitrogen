import { createClient } from '@supabase/supabase-js'

export function useSupabase() {
  const config = useRuntimeConfig()

  const url = config.supabaseUrl as string
  const key = config.supabaseKey as string

  if (!url || !key) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase is not configured. Set NUXT_SUPABASE_URL and NUXT_SUPABASE_ANON_KEY in your .env file.',
    })
  }

  return createClient(url, key)
}
